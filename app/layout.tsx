import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gb-tattoo-mcz.oliveiragoncalvesmat.chatgpt.site"),
  title: "GB Tattoo MCZ | Tatuador em Maceió - AL",
  description:
    "Conheça o trabalho do GB Tattoo MCZ. Tatuagens personalizadas em Maceió, portfólio de trabalhos, avaliações e agendamento pelo WhatsApp.",
  keywords: ["tatuador em Maceió", "tattoo Maceió", "GB Tattoo MCZ", "cobertura de tatuagem", "preto e cinza"],
  openGraph: {
    title: "GB Tattoo MCZ | Tatuador em Maceió - AL",
    description: "Arte na pele. Identidade pra vida. Conheça o portfólio e agende sua tattoo.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "GB Tattoo MCZ | Tatuador em Maceió - AL",
    description: "Arte na pele. Identidade pra vida. Conheça o portfólio e agende sua tattoo.",
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
