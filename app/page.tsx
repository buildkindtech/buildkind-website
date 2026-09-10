"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock3,
  CreditCard,
  Database,
  Globe2,
  Mail,
  Monitor,
  PhoneCall,
  Play,
  Search,
  ShieldCheck,
  Workflow,
} from "lucide-react";

const PRIMARY = "#d97706";
const DARK = "#111827";
const WARM = "#faf7f1";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "SimpleFrame", href: "#simpleframe" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const simpleFrameModes = [
  ["Standalone", "iPad or desktop quoting."],
  ["Embedded", "Website quote requests and previews."],
  ["Merchant", "Integrated card processing that beats your current fees."],
];

const pricingTracks = [
  {
    name: "Website redesign",
    price: "From $2,500",
    desc: "Most full builds land around $5,000–$8,500 depending on content, pages, gallery depth, local SEO, and launch support.",
    points: ["Modern frame-shop website", "Content migration", "Local SEO foundation", "Inquiry/quote forms"],
  },
  {
    name: "SimpleFrame POS",
    price: "$69/mo",
    desc: "Our cloud POS for custom frame shops — pricing, vendor catalogs, live frame preview, work orders, customers, invoices, and integrated merchant processing. White-glove setup and data migration included.",
    points: ["Custom framing POS", "120,000+ moulding catalog", "Work orders & invoices", "Beat your current card-processing fees"],
  },
  {
    name: "Custom workflow",
    price: "Custom quote",
    desc: "For staff dashboards, POS/API integration, advanced automation, and ongoing operations support. Shop card processing runs through SimpleFrame merchant. Stripe stays available for BuildKind SaaS billing and custom app workflows — not the register.",
    points: ["SimpleFrame merchant for shop cards", "Stripe for SaaS / custom billing", "Automation and follow-up", "Monthly support"],
  },
];

const services = [
  {
    icon: Globe2,
    title: "Frame shop websites",
    desc: "Modern redesigns, mobile-first layouts, local SEO, galleries, service pages, and content migration built around how framing customers actually decide.",
  },
  {
    icon: Workflow,
    title: "Quote and order workflows",
    desc: "Inquiry forms, artwork upload, frame previews, payment links, follow-up automation, and clear handoff from website lead to in-store job.",
  },
  {
    icon: Database,
    title: "SimpleFrame technology",
    desc: "Vendor catalogs, pricing logic, real-time visual previews, invoices, integrated merchant processing, and POS-ready workflows — with a guarantee to beat the card-processing fees you pay today.",
  },
];

const workflow = [
  { label: "Website visit", detail: "Customer finds you on Google or social", icon: Search },
  { label: "Guided request", detail: "They upload art, choose needs, and ask for a quote", icon: Monitor },
  { label: "Shop review", detail: "Staff sees the request with context instead of a vague email", icon: BarChart3 },
  { label: "Quote + payment", detail: "SimpleFrame merchant turns the quote into a paid order — at lower card fees than you pay now", icon: CreditCard },
  { label: "Follow-up", detail: "Email/SMS reminders and updates keep jobs moving", icon: Mail },
];

const process = [
  { step: "01", title: "Audit the current flow", desc: "We review your website, Google presence, quote process, tools, processor statement, and where leads fall through." },
  { step: "02", title: "Design the shop-specific system", desc: "Not a generic template — the structure matches your services, gallery, customers, pricing style, and staff workflow." },
  { step: "03", title: "Build and launch", desc: "Site, content, forms, SimpleFrame embed, analytics, and local SEO are built together so the launch is usable on day one." },
  { step: "04", title: "Operate and improve", desc: "Ongoing updates, new pages, workflow tweaks, automation, and support as the shop grows." },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex shrink-0 items-center no-underline">
            <Image src="/assets/buildkind-logo.svg" alt="BuildKind Tech" width={440} height={96} className="h-11 w-auto object-contain" unoptimized />
          </a>
          <div className="flex items-center gap-7">
            {navLinks.map((n) => (
              <a key={n.label} href={n.href} className="hidden text-sm font-medium text-gray-700 transition hover:text-amber-700 lg:block">
                {n.label}
              </a>
            ))}
            <a href="#contact" className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-white lg:block" style={{ background: PRIMARY }}>
              Free Website & Ordering Audit
            </a>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-2xl text-gray-700 lg:hidden" aria-label="Open navigation">☰</button>
          </div>
        </div>
        {mobileOpen && (
          <div className="border-t border-gray-200 bg-white px-6 py-4 lg:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((n) => (
                <a key={n.label} href={n.href} onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-gray-700 no-underline">
                  {n.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-center text-sm font-semibold text-white no-underline" style={{ background: PRIMARY }}>
                Free Audit
              </a>
            </div>
          </div>
        )}
      </nav>

      <main id="top">
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#faf7f1] pt-32 pb-20 sm:pt-36 sm:pb-24">
          <div className="absolute inset-0 opacity-[0.045]" style={{ backgroundImage: "linear-gradient(#111827 1px, transparent 1px), linear-gradient(90deg, #111827 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
          <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                Built for custom frame shops
              </div>
              <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-gray-950 sm:text-6xl">
                Websites and ordering workflows for <span style={{ color: PRIMARY }}>frame shops</span>.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                BuildKind helps custom frame shops replace outdated websites with modern sales systems — better galleries, clearer quote requests, online ordering options, and SimpleFrame technology built from 15 years inside the framing industry.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white no-underline shadow-lg shadow-amber-900/10" style={{ background: PRIMARY }}>
                  Get a Free Website & Ordering Audit <ArrowRight size={17} />
                </a>
                <a href="#services" className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-900 no-underline hover:border-gray-500">
                  See our services
                </a>
              </div>
              <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-sm text-gray-600">
                <div className="rounded-xl border border-gray-200 bg-white p-3"><strong className="block text-gray-950">15 years</strong> framing industry</div>
                <div className="rounded-xl border border-gray-200 bg-white p-3"><strong className="block text-gray-950">250+ shops</strong> reached across the U.S.</div>
                <div className="rounded-xl border border-gray-200 bg-white p-3"><strong className="block text-gray-950">Site + workflow</strong> not just pages</div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl shadow-gray-900/10">
                <Image src="/assets/simple-frame-interface.png" alt="SimpleFrame quoting and frame preview interface" width={720} height={840} priority className="h-auto w-full rounded-xl object-cover" />
              </div>
              <div className="absolute -bottom-6 left-5 right-5 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl shadow-gray-900/10 backdrop-blur">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-950"><Workflow size={17} color={PRIMARY} /> One connected customer flow</div>
                <p className="m-0 text-sm leading-6 text-gray-600">Find you → request quote → preview options → approve → pay → follow up.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="scroll-mt-24 bg-white px-5 py-16 sm:px-8" id="services">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">What BuildKind builds</p>
              <h2 className="text-3xl font-bold tracking-[-0.02em] text-gray-950 sm:text-4xl">Not just a prettier website. A better front door for your shop.</h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">Borrowing the AWA operating model: we build the site, the automation, and the workflow — translated specifically for custom framing.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {services.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl border border-gray-200 bg-[#fffdf9] p-7 shadow-sm">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Icon size={22} /></div>
                  <h3 className="mb-3 text-xl font-bold text-gray-950">{title}</h3>
                  <p className="m-0 text-sm leading-7 text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="scroll-mt-24 px-5 py-16 sm:px-8" style={{ background: WARM }} id="workflow">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Workflow infrastructure</p>
                <h2 className="text-3xl font-bold tracking-[-0.02em] text-gray-950 sm:text-4xl">Most shops do not need another disconnected tool.</h2>
                <p className="mt-4 text-base leading-8 text-gray-600">They need one clear path from website visitor to paid framing job. BuildKind connects the parts customers see with the process your staff actually runs.</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                  {workflow.map(({ icon: Icon, label, detail }, i) => (
                    <div key={label} className="relative rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <Icon size={19} color={PRIMARY} />
                        <span className="text-xs font-bold text-gray-400">0{i + 1}</span>
                      </div>
                      <h3 className="mb-2 text-sm font-bold text-gray-950">{label}</h3>
                      <p className="m-0 text-xs leading-5 text-gray-600">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="scroll-mt-24 bg-white px-5 py-16 sm:px-8" id="simpleframe">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-xl shadow-gray-900/5">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-950">
                  <div className="flex items-center gap-2 bg-gray-800 px-4 py-3">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="ml-3 text-xs text-gray-400">simpleframe.app</span>
                  </div>
                  <video autoPlay loop muted playsInline className="block max-h-[560px] w-full bg-slate-950 object-contain">
                    <source src="/assets/demo.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">SimpleFrame</p>
                <h2 className="text-3xl font-bold tracking-[-0.02em] text-gray-950 sm:text-4xl">The frame shop POS — with a merchant fee guarantee.</h2>
                <p className="mt-4 text-base leading-8 text-gray-600">SimpleFrame can run standalone, embed into a new website, or support a staff-guided in-store consultation. Card processing is built in. Shops pay lower card-processing fees than they currently pay. Send us your processor statement — if we cannot beat it, we will say so honestly.</p>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {simpleFrameModes.map(([title, desc]) => (
                    <div key={title} className="rounded-xl border border-gray-200 p-4">
                      <h3 className="mb-1 text-sm font-bold text-gray-950">{title}</h3>
                      <p className="m-0 text-xs leading-5 text-gray-600">{desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a href="https://simpleframe.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 no-underline">
                    Open SimpleFrame <ArrowRight size={16} />
                  </a>
                  <a href="https://pos.simpleframe.app/login" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 no-underline hover:text-amber-700">
                    Try the live POS demo <Play size={14} fill="currentColor" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-3xl border border-amber-200 bg-[#fffdf9] p-6 shadow-sm sm:p-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    <ShieldCheck size={14} /> Merchant fee guarantee
                  </div>
                  <h3 className="text-2xl font-bold tracking-[-0.02em] text-gray-950 sm:text-3xl">Pay less to take cards than you do today.</h3>
                  <p className="mt-3 text-base leading-8 text-gray-600">Email your latest processor statement to <a href="mailto:info@buildkind.tech" className="font-semibold text-amber-800 no-underline">info@buildkind.tech</a>. We compare it to SimpleFrame merchant processing. If we cannot beat what you currently pay, we tell you honestly — and we will not ask you to switch anyway.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-white no-underline shadow-lg shadow-amber-900/10" style={{ background: PRIMARY }}>
                    Talk to BuildKind <ArrowRight size={16} />
                  </a>
                  <a href="mailto:info@buildkind.tech" className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-900 no-underline hover:border-gray-500">
                    <Mail size={15} /> info@buildkind.tech
                  </a>
                  <a href="https://simpleframe.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-900 no-underline hover:border-gray-500">
                    Open SimpleFrame <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8" style={{ background: WARM }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Process</p>
              <h2 className="text-3xl font-bold tracking-[-0.02em] text-gray-950 sm:text-4xl">A practical build process for busy shop owners.</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {process.map((p) => (
                <div key={p.step} className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="mb-5 text-xs font-bold tracking-[0.18em] text-amber-700">{p.step}</div>
                  <h3 className="mb-3 text-lg font-bold text-gray-950">{p.title}</h3>
                  <p className="m-0 text-sm leading-7 text-gray-600">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="scroll-mt-24 px-5 py-16 sm:px-8" style={{ background: WARM }} id="pricing">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Investment</p>
              <h2 className="text-3xl font-bold tracking-[-0.02em] text-gray-950 sm:text-4xl">Clear tracks for website, SimpleFrame POS, and custom workflow work.</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {pricingTracks.map((p) => (
                <div key={p.name} className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
                  <h3 className="mb-2 text-xl font-bold text-gray-950">{p.name}</h3>
                  <div className="mb-4 text-3xl font-bold tracking-[-0.03em] text-gray-950">{p.price}</div>
                  <p className="mb-5 text-sm leading-7 text-gray-600">{p.desc}</p>
                  <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {p.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle className="mt-0.5 shrink-0" size={15} color={PRIMARY} />{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-16 sm:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <Image src="/assets/workspace.jpg" alt="BuildKind workspace" width={700} height={520} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Built by a framer</p>
              <h2 className="text-3xl font-bold tracking-[-0.02em] text-gray-950 sm:text-4xl">Not a general web studio trying to learn framing from scratch.</h2>
              <p className="mt-4 text-base leading-8 text-gray-600">Aaron spent 15 years in custom framing, including seven years running operations at Monarch Moulding. BuildKind uses that inside knowledge to design websites, quote flows, and software around how frame shops actually sell, price, communicate, and deliver work.</p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-4"><ShieldCheck className="mb-3" size={20} color={PRIMARY} /><strong className="block text-gray-950">Industry-specific judgment</strong><span className="text-sm text-gray-600">Services, galleries, quote language, and workflow are framed correctly.</span></div>
                <div className="rounded-xl border border-gray-200 p-4"><Clock3 className="mb-3" size={20} color={PRIMARY} /><strong className="block text-gray-950">Founder-led support</strong><span className="text-sm text-gray-600">You work directly with the person designing and building the system.</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 px-5 py-16 sm:px-8" style={{ background: DARK }}>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-400">Free audit</p>
              <h2 className="text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Send your current site — and your processor statement if you want a fee review.</h2>
              <p className="mt-4 text-base leading-8 text-gray-300">No generic sales deck. I’ll look at what customers see, how inquiries come in, what you pay to take cards, and where BuildKind could make the process cleaner.</p>
              <div className="mt-7 flex flex-col gap-3 text-sm text-gray-300">
                <a href="tel:+14696132763" className="inline-flex items-center gap-2 text-gray-300 no-underline"><PhoneCall size={15} color="#f59e0b" /> (469) 613-2763</a>
                <a href="mailto:info@buildkind.tech" className="inline-flex items-center gap-2 text-gray-300 no-underline"><Mail size={15} color="#f59e0b" /> info@buildkind.tech</a>
              </div>
            </div>

            {status === "success" ? (
              <div className="rounded-2xl border border-white/10 bg-white p-8">
                <h3 className="mb-2 text-xl font-bold text-gray-950">Thanks. I’ll be in touch.</h3>
                <p className="m-0 text-gray-600">I’ll review your note and get back within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl shadow-black/20 sm:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="text-sm font-bold text-gray-700">Name<input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-normal outline-none focus:border-amber-600" /></label>
                  <label className="text-sm font-bold text-gray-700">Email<input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@yourshop.com" className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-normal outline-none focus:border-amber-600" /></label>
                </div>
                <label className="mt-4 block text-sm font-bold text-gray-700">Shop name<input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="Your frame shop" className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-normal outline-none focus:border-amber-600" /></label>
                <label className="mt-4 block text-sm font-bold text-gray-700">What should I review?<textarea required rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Send your current site and what you want improved: more quote requests, better gallery, SimpleFrame, card-processing fees, automation, etc." className="mt-2 w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm font-normal leading-6 outline-none focus:border-amber-600" /></label>
                {status === "error" && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Something went wrong. Email me directly: info@buildkind.tech</p>}
                <button disabled={status === "loading"} type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-4 text-sm font-bold text-white disabled:opacity-60" style={{ background: PRIMARY }}>
                  {status === "loading" ? "Sending..." : <>Request free audit <ArrowRight size={16} /></>}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-950 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-start">
          <div>
            <Image src="/assets/buildkind-logo-light.svg" alt="BuildKind Tech" width={440} height={96} className="h-10 w-auto object-contain" unoptimized />
            <p className="mt-3 max-w-sm text-sm leading-7 text-gray-500">Technology for frame shops: websites, SimpleFrame POS with a merchant fee guarantee, and practical workflow systems built by a framer.</p>
          </div>
          <div className="flex flex-wrap gap-10 text-sm">
            <div className="flex flex-col gap-2"><strong className="text-white">Products</strong><a href="#simpleframe" className="text-gray-500 no-underline">Merchant fee guarantee</a><a href="https://simpleframe.app" className="text-gray-500 no-underline">SimpleFrame</a><a href="https://pos.simpleframe.app/login" className="text-gray-500 no-underline">Live POS demo</a><a href="#services" className="text-gray-500 no-underline">Websites</a></div>
            <div className="flex flex-col gap-2"><strong className="text-white">Contact</strong><a href="tel:+14696132763" className="text-gray-500 no-underline">(469) 613-2763</a><a href="mailto:info@buildkind.tech" className="text-gray-500 no-underline">info@buildkind.tech</a></div>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-7xl flex-col justify-between gap-3 border-t border-gray-800 pt-6 text-xs text-gray-600 sm:flex-row">
          <span>© 2026 BuildKind Tech LLC. All rights reserved.</span>
          <a href="https://pos.simpleframe.app/login" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-amber-500 no-underline"><Play size={12} fill="currentColor" /> Try the live POS demo</a>
        </div>
      </footer>
    </>
  );
}
