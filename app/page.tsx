"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  MapPin,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WHATSAPP_NUMBER = "558294052052";
const INSTAGRAM_URL = "https://www.instagram.com/gbtattoomcz_oficial";
const FEEDBACK_URL =
  "https://www.instagram.com/stories/highlights/18002897434787821/";

const quickMessage = encodeURIComponent(
  "Olá! Vi o portfólio do GB Tattoo pelo site e gostaria de tirar algumas dúvidas sobre uma tatuagem.",
);
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${quickMessage}`;

type Category = "Todos" | "Preto e cinza" | "Cobertura" | "Old school" | "Colorido";

const portfolioItems: Array<{
  src: string;
  title: string;
  category: Exclude<Category, "Todos">;
  position?: string;
}> = [
  { src: "/images/portfolio/work-08.jpg", title: "Costas em grande escala", category: "Preto e cinza", position: "center 35%" },
  { src: "/images/portfolio/work-01.jpg", title: "Composição tradicional", category: "Old school" },
  { src: "/images/portfolio/work-04.jpg", title: "Fechamento de braço", category: "Preto e cinza" },
  { src: "/images/portfolio/work-03.jpg", title: "Projeto autoral", category: "Colorido" },
  { src: "/images/portfolio/work-10.jpg", title: "Cobertura realista", category: "Cobertura" },
  { src: "/images/portfolio/work-09.jpg", title: "Composição religiosa", category: "Preto e cinza" },
  { src: "/images/portfolio/work-07.jpg", title: "Realismo animal", category: "Colorido" },
  { src: "/images/portfolio/work-05.jpg", title: "Reconstrução e cobertura", category: "Cobertura" },
  { src: "/images/portfolio/work-11.jpg", title: "Peitoral em preto e cinza", category: "Preto e cinza" },
  { src: "/images/portfolio/work-06.jpg", title: "Braço ornamental", category: "Preto e cinza" },
  { src: "/images/portfolio/work-12.jpg", title: "Projeto de peitoral", category: "Preto e cinza" },
];

const categories: Category[] = ["Todos", "Preto e cinza", "Cobertura", "Old school", "Colorido"];

const navLinks = [
  ["Início", "#inicio"],
  ["Artista", "#artista"],
  ["Portfólio", "#portfolio"],
  ["Avaliações", "#avaliacoes"],
  ["Contato", "#contato"],
];

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <p className="mb-6 flex items-center gap-3 text-[0.66rem] font-extrabold uppercase tracking-[0.28em] text-white/45">
      <span className="text-[#a91e24]">{number}</span>
      <span className="h-px w-8 bg-white/20" />
      {children}
    </p>
  );
}

function CursorGlow() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (cursor.current) {
        cursor.current.style.transform = `translate3d(${event.clientX - 18}px, ${event.clientY - 18}px, 0)`;
      }
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return <div ref={cursor} className="cursor-glow" aria-hidden="true" />;
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [category, setCategory] = useState<Category>("Todos");
  const [selectedWork, setSelectedWork] = useState<(typeof portfolioItems)[number] | null>(null);
  const [style, setStyle] = useState("");
  const [contactVisible, setContactVisible] = useState(false);
  const heroMedia = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32);
      if (heroMedia.current) {
        heroMedia.current.style.transform = `translate3d(0, ${Math.min(window.scrollY * 0.08, 48)}px, 0)`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [category]);

  useEffect(() => {
    const contact = document.querySelector("#contato");
    if (!contact) return;
    const observer = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  const filteredWorks = category === "Todos" ? portfolioItems : portfolioItems.filter((item) => item.category === category);

  function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = `Olá! Encontrei o trabalho do GB Tattoo pelo site e gostaria de solicitar um orçamento.

Meu nome é: ${data.get("name") || ""}
Meu WhatsApp: ${data.get("phone") || ""}
Local da tatuagem: ${data.get("bodyPart") || ""}
Tamanho aproximado: ${data.get("size") || ""}
Estilo: ${style || "A definir com o artista"}

Minha ideia é:
${data.get("idea") || ""}

${data.get("reference") ? "Tenho uma imagem de referência e enviarei por aqui." : "Ainda não tenho uma imagem de referência."}

Gostaria de saber valores e disponibilidade para agendamento.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070707] text-white">
      <CursorGlow />

      <header className={`fixed inset-x-0 top-0 z-40 border-b transition-all duration-500 ${scrolled ? "border-white/10 bg-[#080808]/92 shadow-2xl backdrop-blur-xl" : "border-transparent bg-transparent"}`}>
        <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center justify-between px-4 sm:h-20 sm:px-8 lg:px-12">
          <a href="#inicio" className="group flex items-center gap-3" aria-label="GB Tattoo MCZ — início">
            <span className="grid size-11 place-items-center rounded-full border border-[#8e171c]/80 font-black tracking-tighter transition group-hover:bg-[#8e171c]">GB</span>
            <span className="hidden text-[0.68rem] font-bold uppercase tracking-[0.28em] text-white/70 sm:block">Tattoo MCZ</span>
          </a>

          <nav className="hidden items-center gap-8 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/65 lg:flex" aria-label="Navegação principal">
            {navLinks.slice(1).map(([label, href]) => (
              <a key={href} className="transition hover:text-white" href={href}>{label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a className="hidden p-3 text-white/70 transition hover:text-white sm:block" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram do GB Tattoo">
              <span className="text-xs font-black tracking-[-0.08em]">IG</span>
            </a>
            <a className="hidden h-11 items-center gap-2 bg-[#8e171c] px-5 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] transition hover:bg-[#a91e24] sm:inline-flex" href={whatsappUrl} target="_blank" rel="noreferrer">
              Agendar <ArrowUpRight size={15} />
            </a>
            <Sheet>
              <SheetTrigger className="grid size-11 place-items-center border border-white/15 bg-black/20 lg:hidden" aria-label="Abrir menu">
                <Menu size={20} />
              </SheetTrigger>
              <SheetContent className="w-full border-white/10 bg-[#090909] p-6 sm:max-w-md sm:p-8">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Navegação do site GB Tattoo MCZ</SheetDescription>
                <div className="mt-16 flex flex-col">
                  {navLinks.map(([label, href], index) => (
                    <SheetClose asChild key={href}>
                      <a href={href} className="flex items-center justify-between border-b border-white/10 py-5 text-3xl font-black uppercase tracking-[-0.04em]">
                        <span>{label}</span><span className="text-xs text-white/30">0{index + 1}</span>
                      </a>
                    </SheetClose>
                  ))}
                </div>
                <a className="mt-10 inline-flex h-14 items-center justify-center gap-3 bg-[#8e171c] text-xs font-black uppercase tracking-[0.16em]" href={whatsappUrl} target="_blank" rel="noreferrer">
                  Agendar pelo WhatsApp <ArrowUpRight size={17} />
                </a>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section id="inicio" className="hero-section relative isolate flex min-h-[100svh] items-end overflow-hidden">
        <div ref={heroMedia} className="hero-background absolute inset-0 bg-black will-change-transform">
          <Image src="/images/gb-tattoo-logo.png" alt="Logo GB Tattoo Studio" fill priority className="hero-image hero-background-art" sizes="100vw" />
        </div>
        <div className="hero-overlay absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.97)_0%,rgba(5,5,5,.72)_45%,rgba(5,5,5,.17)_78%),linear-gradient(0deg,rgba(5,5,5,.97)_0%,transparent_55%)]" />
        <div className="grain absolute inset-0 opacity-[0.08]" />
        <div className="hero-content relative mx-auto grid w-full max-w-[1440px] gap-10 px-5 pb-7 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:grid-cols-[1fr_320px] lg:px-12 lg:pb-20">
          <div className="max-w-5xl">
            <p className="hero-kicker mb-4 flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white/65 sm:mb-5 sm:text-xs sm:tracking-[0.28em]"><span className="h-px w-8 bg-[#a91e24] sm:w-10" /> Maceió — Alagoas</p>
            <h1 className="hero-title max-w-4xl text-[clamp(3.55rem,10vw,9.6rem)] font-black uppercase leading-[0.78] tracking-[-0.075em]">
              Arte na pele.<br /><span className="outline-text">Identidade</span><br />pra vida.
            </h1>
            <div className="hero-intro mt-6 flex max-w-3xl flex-col gap-5 border-l border-[#8e171c] pl-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-7 sm:pl-7">
              <p className="max-w-md text-[0.94rem] leading-6 text-white/67 sm:text-lg sm:leading-relaxed">Tatuagens autorais, coberturas em alto padrão e trabalhos premiados — criados para transformar sua ideia em algo único.</p>
              <div className="hero-actions flex flex-col gap-2.5 sm:min-w-60 sm:gap-3">
                <a className="cta-light inline-flex h-14 items-center justify-center gap-3 bg-white px-6 text-xs font-extrabold uppercase tracking-[0.14em] transition hover:bg-[#8e171c]" href={whatsappUrl} target="_blank" rel="noreferrer">Agendar minha tattoo <ArrowUpRight size={16} /></a>
                <a className="inline-flex h-12 items-center justify-center gap-2 border border-white/25 px-6 text-xs font-bold uppercase tracking-[0.14em] transition hover:border-white" href="#portfolio">Ver trabalhos</a>
              </div>
            </div>
          </div>
          <div className="hidden self-end border-t border-white/20 pt-5 lg:block">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-white/45">Reconhecimento público</p>
            <p className="mt-2 text-4xl font-black tracking-[-0.06em]">45× <span className="text-base font-medium tracking-normal text-white/55">premiado</span></p>
            <p className="mt-5 text-sm leading-relaxed text-white/48">Preto e cinza • Coberturas • Delicadas • Old school</p>
          </div>
        </div>
        <a href="#artista" className="absolute bottom-7 right-6 hidden items-center gap-3 text-[0.58rem] font-bold uppercase tracking-[0.26em] text-white/45 xl:flex">Scroll para explorar <ArrowDown className="scroll-arrow" size={14} /></a>
      </section>

      <section id="artista" className="relative border-t border-white/10 bg-[#0a0a0a] py-20 sm:py-32">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 sm:gap-14 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-12">
          <div data-reveal className="reveal artist-portrait relative min-h-[410px] overflow-hidden bg-[#111] lg:min-h-[690px]">
            <Image src="/images/portfolio/work-02.jpg" alt="GB Tattoo MCZ entre os três melhores no Encontro de Tatuadores de Maceió" fill className="object-cover object-center grayscale-[15%]" sizes="(max-width: 1024px) 100vw, 55vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/55">Registro público</p>
              <p className="mt-2 max-w-md text-2xl font-black uppercase leading-tight">Entre os três melhores no Encontro de Tatuadores de Maceió</p>
            </div>
          </div>
          <div data-reveal className="reveal flex flex-col justify-center lg:pl-10">
            <SectionLabel number="01">Sobre o artista</SectionLabel>
            <h2 className="max-w-xl text-[clamp(3rem,6vw,6.5rem)] font-black uppercase leading-[0.86] tracking-[-0.065em]">Técnica, cuidado e <span className="text-[#a91e24]">identidade.</span></h2>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/62 sm:mt-8 sm:text-lg sm:leading-8">O GB Tattoo MCZ desenvolve projetos personalizados em Maceió, com atenção à leitura do corpo, acabamento e durabilidade. O portfólio público reúne trabalhos em preto e cinza, delicados, old school, grandes composições e coberturas em alto padrão.</p>
            <p className="mt-5 max-w-xl leading-7 text-white/48">Do primeiro contato ao pós-tattoo, cada etapa é conduzida com orientação clara, materiais adequados e foco em uma experiência segura e profissional.</p>
            <div className="mt-10 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3">
              <div className="bg-[#0a0a0a] p-6"><strong className="block text-4xl font-black text-white">45×</strong><span className="mt-2 block text-xs uppercase tracking-[0.16em] text-white/45">Premiado</span></div>
              <div className="bg-[#0a0a0a] p-6"><strong className="block text-xl font-black uppercase text-white">Autoral</strong><span className="mt-2 block text-xs uppercase tracking-[0.16em] text-white/45">Projeto personalizado</span></div>
              <div className="col-span-2 bg-[#0a0a0a] p-6 sm:col-span-1"><strong className="block text-xl font-black uppercase text-white">Maceió</strong><span className="mt-2 block text-xs uppercase tracking-[0.16em] text-white/45">Alagoas</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="bg-[#070707] py-20 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div data-reveal className="reveal flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <SectionLabel number="02">Portfólio</SectionLabel>
              <h2 className="text-[clamp(3rem,7vw,7.3rem)] font-black uppercase leading-[0.82] tracking-[-0.07em]">Trabalhos<br /><span className="outline-text">recentes.</span></h2>
            </div>
            <div className="portfolio-filters -mx-5 flex max-w-2xl snap-x gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0" role="group" aria-label="Filtrar portfólio">
              {categories.map((item) => (
                <button key={item} onClick={() => setCategory(item)} className={`shrink-0 snap-start border px-4 py-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] transition ${category === item ? "border-[#8e171c] bg-[#8e171c] text-white" : "border-white/15 text-white/55 hover:border-white/45 hover:text-white"}`}>{item}</button>
              ))}
            </div>
          </div>

          <div className="mt-8 columns-2 gap-2.5 sm:mt-12 sm:columns-3 sm:gap-3 lg:columns-4 lg:gap-5">
            {filteredWorks.map((item, index) => (
              <button key={item.src} data-reveal onClick={() => setSelectedWork(item)} className={`reveal portfolio-card group relative mb-3 block w-full overflow-hidden text-left lg:mb-5 ${index % 5 === 0 ? "aspect-[3/4]" : index % 3 === 0 ? "aspect-[4/5]" : "aspect-square"}`}>
                <Image src={item.src} alt={`${item.title} — trabalho de ${item.category} do GB Tattoo MCZ`} fill loading="lazy" className="object-cover transition duration-700 group-hover:scale-105" style={{ objectPosition: item.position }} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 transition group-hover:opacity-100" />
                <span className="portfolio-caption absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">
                  <span className="block text-[0.58rem] font-bold uppercase tracking-[0.2em] text-[#d74b50]">{item.category}</span>
                  <span className="mt-1 flex items-center justify-between text-sm font-bold uppercase"><span>{item.title}</span><ArrowUpRight size={16} /></span>
                </span>
              </button>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-white/38">Imagens publicadas no Instagram oficial do artista.</p>
        </div>
      </section>

      <Dialog open={Boolean(selectedWork)} onOpenChange={(open) => !open && setSelectedWork(null)}>
        <DialogContent className="max-h-[92vh] max-w-[min(92vw,900px)] overflow-hidden border-white/15 bg-[#080808] p-0" showCloseButton>
          <DialogTitle className="sr-only">{selectedWork?.title}</DialogTitle>
          <DialogDescription className="sr-only">Trabalho do portfólio GB Tattoo MCZ</DialogDescription>
          {selectedWork && (
            <div className="grid max-h-[92vh] md:grid-cols-[1fr_240px]">
              <div className="relative min-h-[65vh] bg-black"><Image src={selectedWork.src} alt={selectedWork.title} fill className="object-contain" sizes="90vw" /></div>
              <div className="flex flex-col justify-end p-7">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#d74b50]">{selectedWork.category}</p>
                <p className="mt-2 text-2xl font-black uppercase">{selectedWork.title}</p>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="cta-light mt-6 inline-flex h-12 items-center justify-center gap-2 bg-white text-xs font-bold uppercase tracking-[0.14em]">Quero algo assim <ArrowUpRight size={15} /></a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <section id="processo" className="border-y border-white/10 bg-[#0c0c0c] py-20 sm:py-32">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div data-reveal className="reveal max-w-3xl"><SectionLabel number="03">Da ideia à tatuagem</SectionLabel><h2 className="text-[clamp(3rem,6vw,6rem)] font-black uppercase leading-[0.86] tracking-[-0.06em]">Seu projeto,<br />passo a passo.</h2></div>
          <div className="mt-10 grid gap-px bg-white/10 sm:mt-14 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Sua ideia", "Conte o que você imagina, o local do corpo e as referências que fazem sentido."],
              ["02", "Criação", "O conceito é desenvolvido ou adaptado para funcionar de verdade na pele."],
              ["03", "Agendamento", "Alinhamos tamanho, detalhes, valor, data e horário pelo WhatsApp."],
              ["04", "Tattoo", "No estúdio, o projeto ganha vida com cuidado em cada etapa."],
            ].map(([number, title, text]) => (
              <article data-reveal key={number} className="reveal process-card group min-h-0 bg-[#0c0c0c] p-6 transition hover:bg-[#111] sm:min-h-72 sm:p-9">
                <span className="text-xs font-bold tracking-[0.2em] text-[#a91e24]">{number}</span>
                <h3 className="mt-9 text-2xl font-black uppercase tracking-[-0.04em] sm:mt-16">{title}</h3>
                <p className="mt-4 leading-7 text-white/48">{text}</p>
                <ArrowRight className="mt-6 text-white/25 transition group-hover:translate-x-2 group-hover:text-white sm:mt-8" size={20} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="avaliacoes" className="relative overflow-hidden bg-[#070707] py-20 sm:py-32">
        <div className="absolute right-[-8%] top-[-20%] size-[540px] rounded-full bg-[#8e171c]/10 blur-[120px]" />
        <div className="relative mx-auto grid max-w-[1320px] gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12">
          <div data-reveal className="reveal"><SectionLabel number="04">Confiança</SectionLabel><h2 className="text-[clamp(3rem,6vw,6rem)] font-black uppercase leading-[0.86] tracking-[-0.06em]">Quem faz,<br /><span className="text-[#a91e24]">recomenda.</span></h2><p className="mt-7 max-w-md leading-7 text-white/50">Para preservar a autenticidade, não publicamos depoimentos sem identificação verificável. Os feedbacks reais estão reunidos no destaque oficial do Instagram.</p><a href={FEEDBACK_URL} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 border-b border-white/30 pb-2 text-xs font-bold uppercase tracking-[0.16em]">Ver feedbacks reais <ArrowUpRight size={15} /></a></div>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {[
              { icon: MessageCircle, title: "Feedbacks públicos", text: "Avaliações compartilhadas pelo próprio artista no destaque oficial do perfil." },
              { icon: Sparkles, title: "45× premiado", text: "Reconhecimento declarado publicamente na bio oficial do GB Tattoo MCZ." },
              { icon: ShieldCheck, title: "Cobertura em alto padrão", text: "Uma especialidade apresentada no perfil e comprovada por trabalhos de antes e depois." },
              { icon: CalendarDays, title: "Atendimento direto", text: "Orçamento e agendamento pelo canal oficial do estúdio no WhatsApp." },
            ].map(({ icon: Icon, title, text }) => (
              <article data-reveal key={title} className="reveal trust-card border border-white/10 bg-white/[0.025] p-6 sm:p-8"><Icon className="text-[#a91e24]" size={24} strokeWidth={1.5} /><h3 className="mt-6 text-xl font-black uppercase sm:mt-8">{title}</h3><p className="mt-3 leading-7 text-white/47 sm:mt-4">{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-project relative isolate min-h-[560px] overflow-hidden sm:min-h-[68vh]">
        <Image src="/images/portfolio/work-04.jpg" alt="Fechamento de braço em preto e cinza" fill className="object-cover object-[50%_35%]" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,6,6,.96),rgba(6,6,6,.6),rgba(6,6,6,.35)),linear-gradient(0deg,rgba(6,6,6,.7),transparent)]" />
        <div data-reveal className="reveal relative mx-auto flex min-h-[560px] max-w-[1320px] flex-col items-start justify-center px-5 py-16 sm:min-h-[68vh] sm:px-8 sm:py-20 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/55">Seu próximo projeto começa aqui</p>
          <h2 className="mt-5 max-w-4xl text-[clamp(3.2rem,8vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.07em]">Tem uma ideia<br />de tatuagem?</h2>
          <p className="mt-7 max-w-lg text-lg leading-8 text-white/62">Conte sua ideia e vamos transformar ela em um projeto único.</p>
          <a href="#contato" className="cta-project-button mt-8 inline-flex h-14 items-center gap-5 bg-[#8e171c] px-7 text-xs font-black uppercase tracking-[0.18em] transition hover:bg-white hover:text-black sm:mt-9 sm:h-16 sm:px-8">Pedir orçamento <ArrowRight className="cta-arrow" size={20} /></a>
        </div>
      </section>

      <section id="contato" className="bg-[#0b0b0b] py-20 sm:py-32">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 sm:gap-14 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12">
          <div data-reveal className="reveal">
            <SectionLabel number="05">Agendamento</SectionLabel>
            <h2 className="text-[clamp(3rem,6vw,6rem)] font-black uppercase leading-[0.86] tracking-[-0.06em]">Agende sua<br />tatuagem.</h2>
            <p className="mt-7 max-w-md leading-7 text-white/50">Preencha os detalhes principais. Ao continuar, sua mensagem será montada automaticamente para o WhatsApp oficial.</p>
            <div className="mt-10 flex items-start gap-4 border-t border-white/10 pt-7"><MapPin className="mt-1 text-[#a91e24]" size={21} /><div><p className="font-bold uppercase">Maceió — AL</p><p className="mt-2 text-sm leading-6 text-white/42">O endereço completo é compartilhado durante o agendamento pelo canal oficial.</p></div></div>
          </div>

          <form data-reveal onSubmit={handleBooking} className="booking-form reveal grid gap-4 border border-white/10 bg-[#080808] p-5 sm:grid-cols-2 sm:gap-5 sm:p-8 lg:p-10">
            <label className="field"><span>Nome</span><input required name="name" autoComplete="name" placeholder="Como podemos chamar você?" /></label>
            <label className="field"><span>WhatsApp</span><input required name="phone" inputMode="tel" autoComplete="tel" placeholder="(82) 99999-9999" /></label>
            <label className="field"><span>Parte do corpo</span><input required name="bodyPart" placeholder="Ex.: antebraço" /></label>
            <label className="field"><span>Tamanho aproximado</span><input required name="size" placeholder="Ex.: 20 cm" /></label>
            <label className="field sm:col-span-2"><span>Estilo da tatuagem</span>
              <Select value={style} onValueChange={setStyle} required>
                <SelectTrigger className="h-14 w-full rounded-none border-white/15 bg-[#111] px-4 text-left text-white shadow-none"><SelectValue placeholder="Selecione uma opção" /></SelectTrigger>
                <SelectContent className="rounded-none border-white/15 bg-[#111] text-white">
                  <SelectItem value="Preto e cinza">Preto e cinza</SelectItem><SelectItem value="Cobertura">Cobertura</SelectItem><SelectItem value="Delicada">Delicada</SelectItem><SelectItem value="Old school">Old school</SelectItem><SelectItem value="Colorida">Colorida</SelectItem><SelectItem value="Quero orientação">Quero orientação</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <label className="field sm:col-span-2"><span>Descrição da ideia</span><textarea required name="idea" rows={5} placeholder="Conte o que você imagina, elementos importantes e referências de estilo." /></label>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-white/55 sm:col-span-2"><input type="checkbox" name="reference" className="mt-1 size-4 accent-[#8e171c]" /><span><strong className="text-white/80">Tenho uma imagem de referência.</strong><br />Você poderá enviá-la pelo WhatsApp na próxima etapa.</span></label>
            <button type="submit" className="booking-submit mt-2 inline-flex h-16 items-center justify-center gap-3 bg-[#8e171c] px-6 text-xs font-black uppercase tracking-[0.16em] transition hover:bg-white sm:col-span-2">Continuar pelo WhatsApp <ArrowUpRight size={18} /></button>
          </form>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#070707] py-20 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div data-reveal className="reveal flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><SectionLabel number="06">Instagram</SectionLabel><h2 className="instagram-heading text-[clamp(2.8rem,6vw,6rem)] font-black uppercase leading-[0.86] tracking-[-0.06em]">Acompanhe o<br />trabalho de perto.</h2></div><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.12em]">@gbtattoomcz_oficial <ArrowUpRight size={18} /></a></div>
          <div className="mt-9 grid grid-cols-2 gap-2 sm:mt-12 md:grid-cols-4">
            {["work-01.jpg", "work-08.jpg", "work-09.jpg", "work-03.jpg"].map((image, index) => (
              <a data-reveal key={image} href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="reveal group relative aspect-square overflow-hidden"><Image src={`/images/portfolio/${image}`} alt={`Trabalho do portfólio GB Tattoo MCZ ${index + 1}`} fill loading="lazy" className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" /><span className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 transition group-hover:opacity-100"><span className="text-xs font-black uppercase tracking-[0.18em]">Ver no Instagram</span></span></a>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#050505] px-5 py-12 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-12 lg:flex-row lg:items-start">
            <div><div className="flex items-center gap-4"><span className="grid size-14 place-items-center rounded-full border border-[#8e171c] text-lg font-black">GB</span><div><p className="font-black uppercase tracking-[0.12em]">GB Tattoo MCZ</p><p className="mt-1 text-sm text-white/35">Maceió — Alagoas</p></div></div></div>
            <nav className="flex flex-wrap gap-x-7 gap-y-4 text-xs font-bold uppercase tracking-[0.14em] text-white/50" aria-label="Navegação do rodapé">{navLinks.map(([label, href]) => <a key={href} href={href} className="transition hover:text-white">{label}</a>)}<a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="transition hover:text-white">Instagram</a><a href={whatsappUrl} target="_blank" rel="noreferrer" className="transition hover:text-white">WhatsApp</a></nav>
          </div>
          <div className="flex flex-col gap-3 pt-7 text-xs text-white/28 sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} GB Tattoo MCZ. Todos os direitos reservados.</p><p>Arte autoral. Imagens do portfólio oficial.</p></div>
        </div>
      </footer>

      <a href={whatsappUrl} target="_blank" rel="noreferrer" className={`floating-whatsapp ${scrolled ? "is-scrolled" : ""} ${contactVisible ? "contact-visible" : ""} group fixed bottom-4 right-4 z-30 flex h-13 min-w-13 items-center justify-center rounded-full bg-[#25d366] px-3.5 text-black shadow-[0_12px_40px_rgba(37,211,102,.3)] transition hover:-translate-y-1 sm:bottom-5 sm:right-5 sm:h-14 sm:px-4`} aria-label="Solicitar orçamento pelo WhatsApp"><MessageCircle size={22} fill="currentColor" /><span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-black uppercase tracking-[0.12em] opacity-0 transition-all duration-300 group-hover:ml-3 group-hover:max-w-44 group-hover:opacity-100">Solicitar orçamento</span></a>
    </main>
  );
}
