import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright-core";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const outputDirectory = path.join(projectRoot, "output", "pdf");
const siteUrl = process.env.GB_TATTOO_SITE_URL ?? "http://localhost:5173/";

const presentations = [
  {
    name: "Desktop",
    filename: "GB-Tattoo-Apresentacao-Desktop.pdf",
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    isMobile: false,
  },
  {
    name: "Mobile",
    filename: "GB-Tattoo-Apresentacao-Mobile.pdf",
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
  },
];

const temporaryPrintCss = `
  @media print {
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }

    html,
    body,
    main,
    section,
    footer {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html,
    body {
      max-width: none !important;
      overflow: visible !important;
      background: #070707 !important;
    }

    [data-reveal],
    .reveal,
    .reveal .section-title,
    .hero-image,
    .hero-kicker-line,
    .hero-kicker-text,
    .hero-title-text,
    .portfolio-card.reveal,
    .portfolio-card.reveal img,
    .image-reveal.reveal,
    .image-reveal.reveal img,
    .section-label-line {
      opacity: 1 !important;
      visibility: visible !important;
      clip-path: none !important;
      transform: none !important;
    }

    header {
      position: absolute !important;
      top: 0 !important;
      right: 0 !important;
      left: 0 !important;
    }

    .cursor-glow,
    .floating-whatsapp {
      display: none !important;
    }

    h1,
    h2,
    h3,
    .section-label,
    article,
    figure,
    form,
    .process-card,
    .trust-card,
    .portfolio-card {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }
  }
`;

function resolveBrowserExecutable() {
  const configuredPath = process.env.PLAYWRIGHT_BROWSER_PATH;
  const candidates = [
    configuredPath,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/microsoft-edge",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);

  const executable = candidates.find((candidate) => existsSync(candidate));
  if (!executable) {
    throw new Error(
      "Chrome, Edge ou Chromium não encontrado. Defina PLAYWRIGHT_BROWSER_PATH com o caminho do navegador.",
    );
  }

  return executable;
}

async function isSiteAvailable() {
  try {
    const response = await fetch(siteUrl, { signal: AbortSignal.timeout(2500) });
    return response.ok;
  } catch {
    return false;
  }
}

async function ensureLocalServer() {
  if (await isSiteAvailable()) return null;

  console.log(`Site indisponível em ${siteUrl}. Iniciando o servidor local...`);
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const server = spawn(npmCommand, ["run", "dev"], {
    cwd: projectRoot,
    env: { ...process.env, BROWSER: "none" },
    stdio: ["ignore", "pipe", "pipe"],
    shell: process.platform === "win32",
    windowsHide: true,
  });

  let serverLog = "";
  const collectLog = (chunk) => {
    serverLog = `${serverLog}${chunk.toString()}`.slice(-8000);
  };
  server.stdout.on("data", collectLog);
  server.stderr.on("data", collectLog);

  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`O servidor local encerrou antes de responder.\n${serverLog}`);
    }
    if (await isSiteAvailable()) return server;
    await new Promise((resolve) => setTimeout(resolve, 750));
  }

  server.kill();
  throw new Error(`Tempo esgotado esperando o servidor local.\n${serverLog}`);
}

function stopLocalServer(server) {
  if (!server || server.exitCode !== null) return;

  if (process.platform === "win32" && server.pid) {
    spawnSync("taskkill.exe", ["/pid", String(server.pid), "/t", "/f"], {
      stdio: "ignore",
      windowsHide: true,
    });
  } else {
    server.kill("SIGTERM");
  }

  server.stdout?.destroy();
  server.stderr?.destroy();
  server.unref();
}

async function revealAndLoadCompletePage(page, presentation) {
  await page.evaluate(async () => {
    const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    const step = Math.max(Math.floor(window.innerHeight * 0.8), 400);

    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await delay(80);
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await delay(250);

    document.querySelectorAll("[data-reveal]").forEach((element) => {
      element.classList.add("is-visible");
    });

    await document.fonts.ready;
    await Promise.all(
      [...document.images].map(async (image) => {
        if (!image.complete) {
          await new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          });
        }
        if (typeof image.decode === "function") {
          try {
            await image.decode();
          } catch {
            // A broken optional image must not prevent the remaining page from being exported.
          }
        }
      }),
    );

    window.scrollTo(0, 0);
  });

  await page.addStyleTag({ content: temporaryPrintCss });
  const heroHeight = presentation.viewport.height;
  const ctaHeight = presentation.isMobile
    ? 520
    : Math.max(560, Math.round(presentation.viewport.height * 0.68));
  await page.addStyleTag({
    content: `
      @media print {
        .hero-section {
          height: ${heroHeight}px !important;
          min-height: ${heroHeight}px !important;
        }
        .cta-project,
        .cta-project > div:last-child {
          min-height: ${ctaHeight}px !important;
        }
      }
    `,
  });
  await page.emulateMedia({ media: "print" });
  await page.evaluate(async () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    window.dispatchEvent(new Event("scroll"));
    await document.fonts.ready;
  });
  await page.waitForTimeout(500);
}

async function generatePresentation(browser, presentation) {
  const context = await browser.newContext({
    viewport: presentation.viewport,
    deviceScaleFactor: presentation.deviceScaleFactor,
    isMobile: presentation.isMobile,
    hasTouch: presentation.isMobile,
    colorScheme: "dark",
  });

  const page = await context.newPage();
  console.log(`Gerando versão ${presentation.name.toLowerCase()}...`);

  await page.goto(siteUrl, { waitUntil: "networkidle", timeout: 120_000 });
  await revealAndLoadCompletePage(page, presentation);

  const dimensions = await page.evaluate(() => ({
    width: Math.ceil(Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)),
    height: Math.ceil(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)),
    imageCount: document.images.length,
    unloadedImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).length,
  }));

  if (dimensions.unloadedImages > 0) {
    throw new Error(`${dimensions.unloadedImages} imagem(ns) não carregaram na versão ${presentation.name}.`);
  }
  if (dimensions.height > 18_500) {
    throw new Error(
      `A página ${presentation.name} tem ${dimensions.height}px de altura e excede o limite seguro para um PDF contínuo.`,
    );
  }

  const outputPath = path.join(outputDirectory, presentation.filename);
  const screenshot = await page.screenshot({
    fullPage: true,
    type: "png",
    animations: "disabled",
    caret: "hide",
    scale: "css",
  });

  const pdfPage = await context.newPage();
  const pdfHeight = dimensions.height + 2;
  await pdfPage.setContent(
    `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>GB Tattoo MCZ - Apresentação ${presentation.name}</title>
          <style>
            @page { size: ${dimensions.width}px ${pdfHeight}px; margin: 0; }
            html, body {
              width: ${dimensions.width}px;
              height: ${pdfHeight}px;
              margin: 0;
              overflow: hidden;
              background: #070707;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            img {
              position: absolute;
              inset: 0 auto auto 0;
              display: block;
              width: ${dimensions.width}px;
              height: ${dimensions.height}px;
            }
          </style>
        </head>
        <body>
          <img alt="Apresentação do site GB Tattoo MCZ - ${presentation.name}" src="data:image/png;base64,${screenshot.toString("base64")}" />
        </body>
      </html>`,
    { waitUntil: "load" },
  );
  await pdfPage.emulateMedia({ media: "print" });
  await pdfPage.pdf({
    path: outputPath,
    width: `${dimensions.width}px`,
    height: `${pdfHeight}px`,
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
    scale: 1,
    tagged: true,
  });
  await pdfPage.close();

  console.log(
    `✓ ${presentation.filename} (${dimensions.width} × ${dimensions.height}px, ${dimensions.imageCount} imagens)`,
  );
  await context.close();
  return outputPath;
}

let localServer = null;
let browser = null;

try {
  await mkdir(outputDirectory, { recursive: true });
  localServer = await ensureLocalServer();
  browser = await chromium.launch({
    executablePath: resolveBrowserExecutable(),
    headless: true,
    args: ["--hide-scrollbars", "--force-color-profile=srgb"],
  });

  for (const presentation of presentations) {
    await generatePresentation(browser, presentation);
  }

  console.log(`\nPDFs salvos em: ${outputDirectory}`);
} finally {
  if (browser) await browser.close();
  stopLocalServer(localServer);
}
