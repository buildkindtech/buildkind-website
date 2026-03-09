"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Eye, Calculator, Sparkles, Smartphone,
  Globe, MonitorSmartphone, ShoppingBag,
  Zap, Search, Image as ImageIcon, PhoneCall,
  CheckCircle, ArrowRight, Mail, Clock,
  ChevronRight, Play, Monitor
} from "lucide-react";

const PRIMARY = "#d97706";
const PRIMARY_LIGHT = "#fef3c7";
const PRIMARY_DARK = "#b45309";
const BG_WARM = "#fffbeb";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "", interest: "Website Redesign" });
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
    } catch { setStatus("error"); }
  };

  const navLinks = ["About", "SimpleFrame", "Websites", "Pricing", "Contact"];

  return (
    <>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Image src="/assets/buildkind-logo.jpeg" alt="BuildKind Tech" width={120} height={48} style={{ borderRadius: 6, objectFit: "contain", height: 44, width: "auto" }} />
          </a>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {navLinks.map(n => (
              <a key={n} href={`#${n.toLowerCase()}`}
                style={{ color: "#374151", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color 0.2s" }}
                className="hidden md:block"
                onMouseEnter={e => (e.currentTarget.style.color = PRIMARY)}
                onMouseLeave={e => (e.currentTarget.style.color = "#374151")}>{n}</a>
            ))}
            <a href="https://simpleframe.app" target="_blank" rel="noopener noreferrer"
              style={{ padding: "9px 18px", border: `1.5px solid ${PRIMARY}`, color: PRIMARY_DARK, borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none", background: "transparent" }}
              className="hidden md:block">
              Try SimpleFrame
            </a>
            <a href="#contact"
              style={{ padding: "9px 18px", background: PRIMARY, color: "white", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}
              className="hidden md:block">
              Free Analysis
            </a>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden"
              style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#374151" }}>☰</button>
          </div>
        </div>
        {mobileOpen && (
          <div style={{ background: "white", borderTop: "1px solid #e5e7eb", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            {navLinks.map(n => <a key={n} href={`#${n.toLowerCase()}`} onClick={() => setMobileOpen(false)} style={{ color: "#374151", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>{n}</a>)}
            <a href="https://simpleframe.app" target="_blank" style={{ padding: "11px 0", textAlign: "center", border: `2px solid ${PRIMARY}`, color: PRIMARY_DARK, borderRadius: 8, fontWeight: 700, textDecoration: "none" }}>Try SimpleFrame</a>
            <a href="#contact" onClick={() => setMobileOpen(false)} style={{ padding: "12px 0", textAlign: "center", background: PRIMARY, color: "white", borderRadius: 8, fontWeight: 700, textDecoration: "none" }}>Free Analysis</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 120, paddingBottom: 100, background: `linear-gradient(135deg, ${BG_WARM} 0%, white 50%, #fff7ed 100%)` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="grid-cols-1 md:grid-cols-2">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999, background: PRIMARY_LIGHT, color: PRIMARY_DARK, fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
              <ImageIcon size={13} />
              Built for Frame Shops, by Industry Insiders
            </div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 900, lineHeight: 1.1, color: "#111827", marginBottom: 20 }}>
              Frame Shop Technology<br />
              <span style={{ color: PRIMARY }}>That Actually Works</span>
            </h1>
            <p style={{ fontSize: 18, color: "#6b7280", lineHeight: 1.8, marginBottom: 36 }}>
              Custom websites and SimpleFrame SaaS — built by someone who spent 7 years behind the counter. We solve real framing problems.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: PRIMARY, color: "white", borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(217,119,6,0.35)" }}>
                Get Free Analysis <ArrowRight size={16} />
              </a>
              <a href="https://simpleframe.app" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", border: `2px solid ${PRIMARY}`, color: PRIMARY_DARK, borderRadius: 10, fontSize: 16, fontWeight: 600, textDecoration: "none", background: "white" }}>
                <Play size={16} fill={PRIMARY_DARK} /> Try SimpleFrame
              </a>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <Image src="/assets/framing-business-website.jpeg" alt="Frame Shop Website" width={600} height={420} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <div style={{ position: "absolute", bottom: -16, left: -16, background: "white", borderRadius: 16, padding: "16px 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: `2px solid ${PRIMARY_LIGHT}`, display: "flex", alignItems: "center", gap: 12 }}>
              <Zap size={22} color={PRIMARY} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: PRIMARY, lineHeight: 1 }}>90+</div>
                <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>Lighthouse Score</div>
              </div>
            </div>
            <div style={{ position: "absolute", top: -16, right: -16, background: PRIMARY, borderRadius: 16, padding: "16px 20px", boxShadow: "0 8px 24px rgba(217,119,6,0.3)", display: "flex", alignItems: "center", gap: 12 }}>
              <Globe size={22} color="white" />
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "white", lineHeight: 1 }}>285+</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>Frame Shops</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO VIDEO */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999, background: PRIMARY_LIGHT, color: PRIMARY_DARK, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
              <Play size={13} /> See It In Action
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#111827", marginBottom: 12 }}>Watch SimpleFrame Work</h2>
            <p style={{ color: "#6b7280", fontSize: 17 }}>Real-time framing preview — no more guessing what the finished piece will look like.</p>
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb", background: "#111827" }}>
            {/* Browser chrome */}
            <div style={{ background: "#1f2937", padding: "12px 16px", display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }}/>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }}/>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981" }}/>
              <div style={{ flex: 1, background: "#374151", borderRadius: 6, padding: "4px 14px", marginLeft: 8, fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 6 }}>
                <Monitor size={11} /> simpleframe.app
              </div>
            </div>
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", display: "block", maxHeight: 600, objectFit: "contain", background: "#0f172a" }}
            >
              <source src="/assets/demo.mp4" type="video/mp4" />
            </video>
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <a href="https://simpleframe.app" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: PRIMARY, color: "white", borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(217,119,6,0.35)" }}>
              Try SimpleFrame Free <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* PROBLEMS */}
      <section style={{ padding: "80px 24px", background: "#1f2937" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "white", marginBottom: 12 }}>Is Your Website Hurting Your Business?</h2>
          <p style={{ color: "#9ca3af", fontSize: 16, marginBottom: 48 }}>Most frame shop websites are driving customers away. Here&apos;s what we see every day:</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              { Icon: Clock, title: "Slow Load Times", desc: "8+ second load times drive customers to your competitors before they see your work." },
              { Icon: Smartphone, title: "Not Mobile-Friendly", desc: "70% of customers browse on mobile — your site doesn't work for them." },
              { Icon: ShoppingBag, title: "No Online Ordering", desc: "Customers want convenience — phone calls aren't enough anymore." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} style={{ background: "#374151", borderRadius: 16, padding: 28, textAlign: "left", border: "1px solid #4b5563" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(217,119,6,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon size={20} color={PRIMARY} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8 }}>{title}</h3>
                <p style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "100px 24px", background: BG_WARM }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="grid-cols-1 md:grid-cols-2">
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.12)" }}>
                <Image src="/assets/custom-framing-workspace.jpeg" alt="Custom Framing Workspace" width={600} height={450} style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} />
              </div>
              <div style={{ position: "absolute", bottom: -20, right: -20, background: PRIMARY, borderRadius: 16, padding: "20px 24px", boxShadow: "0 8px 24px rgba(217,119,6,0.35)" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "white" }}>15 yrs</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>Industry Experience</div>
              </div>
            </div>
            <div>
              <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, background: PRIMARY_LIGHT, color: PRIMARY_DARK, fontSize: 13, fontWeight: 700, marginBottom: 20 }}>About BuildKind Tech</div>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: "#111827", marginBottom: 20 }}>Built by a Framer, for Framers</h2>
              <p style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.8, marginBottom: 32 }}>
                With 15 years in the framing industry and connections with 285+ frame shops across the country, BuildKind Tech understands your business from the inside out. We don&apos;t just build websites — we build tools that solve real problems framers face every day.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { Icon: ImageIcon, label: "Frame Shop Focus" },
                  { Icon: Zap, label: "Industry Expertise" },
                  { Icon: PhoneCall, label: "Personal Support" },
                  { Icon: CheckCircle, label: "Small Business Heart" },
                ].map(({ Icon, label }) => (
                  <div key={label} style={{ background: "white", borderRadius: 12, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: PRIMARY_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={16} color={PRIMARY_DARK} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIMPLEFRAME */}
      <section id="simpleframe" style={{ padding: "100px 24px", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999, background: PRIMARY_LIGHT, color: PRIMARY_DARK, fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
              <Sparkles size={13} /> SimpleFrame SaaS Platform
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#111827", marginBottom: 16 }}>Streamline Your Framing Business</h2>
            <p style={{ fontSize: 18, color: "#6b7280", maxWidth: 600, margin: "0 auto" }}>The only framing calculator with real-time preview, AI style suggestions, and seamless ordering — built for how you actually work.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 56 }}>
            {[
              { Icon: Eye, title: "Real-time Preview", desc: "Show customers exactly how their artwork will look before committing to the frame." },
              { Icon: Calculator, title: "Framing Calculator", desc: "Accurate pricing with material costs and labor automatically calculated." },
              { Icon: Sparkles, title: "AI Style Suggestions", desc: "Auto-recommends trending frame and mat combinations based on uploaded artwork." },
              { Icon: MonitorSmartphone, title: "Works Everywhere", desc: "iPad, desktop, tablet — standalone, embedded on your site, or POS-integrated." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} style={{ background: BG_WARM, borderRadius: 16, padding: 28, border: "1px solid #fde68a" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: PRIMARY_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon size={22} color={PRIMARY_DARK} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{title}</h3>
                <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>



          <div style={{ background: "#f9fafb", borderRadius: 20, padding: 40, border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: "#111827", textAlign: "center", marginBottom: 32 }}>Flexible for Every Shop</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
              {[
                { Icon: MonitorSmartphone, title: "Standalone Mode", desc: "iPad, desktop, or tablet. No website or POS needed. Perfect for solo framers with Stripe payment integration." },
                { Icon: Globe, title: "Embedded Website", desc: "Direct integration into your website. Customers upload art, preview frames, and submit orders or quotes." },
                { Icon: ShoppingBag, title: "POS-Integrated", desc: "In-store sales tool for staff-guided consultations with direct POS system integration." },
              ].map(({ Icon, title, desc }) => (
                <div key={title} style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e5e7eb" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: PRIMARY_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <Icon size={20} color={PRIMARY_DARK} />
                  </div>
                  <h4 style={{ fontSize: 17, fontWeight: 700, color: PRIMARY_DARK, marginBottom: 8 }}>{title}</h4>
                  <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <a href="https://simpleframe.app" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", background: PRIMARY, color: "white", borderRadius: 12, fontSize: 17, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(217,119,6,0.35)" }}>
              Try SimpleFrame for Free <ArrowRight size={18} />
            </a>
            <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 12 }}>No credit card required. Free plan available.</p>
          </div>
        </div>
      </section>

      {/* SIMPLEFRAME PRICING */}
      <section id="pricing" style={{ padding: "100px 24px", background: BG_WARM }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#111827", marginBottom: 12 }}>SimpleFrame Plans</h2>
            <p style={{ color: "#6b7280", fontSize: 18 }}>Start free. Scale as you grow.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              {
                name: "Starter", price: "$7", period: "/month", tag: "", desc: "Small shops using SaaS only",
                sub: "+ $4/month per additional vendor",
                features: ["1 vendor catalog (add more at $4 each)", "Advanced pricing calculator", "Vendor moulding database", "Priority email support", "Save up to 10 designs"],
                limits: ["Max 10 saves", "No bulk operations", "No POS/payment", "Additional vendors $4/month each"],
                cta: "Start 7-Day Free Trial", highlight: false
              },
              {
                name: "Professional", price: "$29", period: "/month", tag: "Most Popular", desc: "Quoting & invoicing-focused shops",
                sub: "",
                features: ["Everything in Starter", "All vendor catalogs", "Bulk ops & batch processing", "Custom pricing rules", "Invoicing & billing (PDF/Email)", "Custom branding", "Email & chat support"],
                limits: ["Single-user account", "No POS/payment (upgrade for POS)"],
                cta: "Start 7-Day Free Trial", highlight: true
              },
              {
                name: "Enterprise", price: "$69", period: "/month", tag: "", desc: "Shops needing SaaS + POS in one platform",
                sub: "",
                features: ["Everything in Professional", "User management (up to 5 users)", "Database migration & setup", "API access (accounting/CRM/ecommerce)", "Dedicated account manager, 24/7 support", "Training & onboarding, advanced analytics", "White-label, SLA", "Full POS integration (Gateway + SaaS)", "Guaranteed lower processing rate", "Design → Quote → Payment → Receipt"],
                limits: [],
                cta: "Start 7-Day Free Trial", highlight: false
              },
            ].map(p => (
              <div key={p.name} style={{
                background: "white", borderRadius: 20, padding: 32, position: "relative",
                border: p.highlight ? `2px solid ${PRIMARY}` : "1px solid #e5e7eb",
                boxShadow: p.highlight ? `0 8px 30px rgba(217,119,6,0.15)` : "0 2px 8px rgba(0,0,0,0.04)"
              }}>
                {p.tag && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: PRIMARY, color: "white", padding: "4px 16px", borderRadius: 999, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{p.tag}</div>}
                <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>{p.desc}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 4 }}>
                  <span style={{ fontSize: 44, fontWeight: 900, color: p.highlight ? PRIMARY : "#111827" }}>{p.price}</span>
                  <span style={{ color: "#9ca3af", fontSize: 15 }}>{p.period}</span>
                </div>
                {p.sub && <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>{p.sub}</div>}
                <div style={{ borderTop: "1px solid #f3f4f6", margin: "16px 0" }} />
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9, marginBottom: p.limits.length ? 16 : 28 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: "flex", gap: 8, fontSize: 13, color: "#374151", alignItems: "flex-start" }}>
                      <CheckCircle size={14} color={PRIMARY} style={{ flexShrink: 0, marginTop: 1 }} />{f}
                    </li>
                  ))}
                </ul>
                {p.limits.length > 0 && (
                  <>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8, fontWeight: 600 }}>Limitations:</div>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, marginBottom: 24 }}>
                      {p.limits.map(l => (
                        <li key={l} style={{ display: "flex", gap: 8, fontSize: 12, color: "#9ca3af", alignItems: "flex-start" }}>
                          <span style={{ flexShrink: 0, marginTop: 1 }}>✕</span>{l}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <a href="https://simpleframe.app" target="_blank" rel="noopener noreferrer" style={{
                  display: "block", padding: "13px 0", textAlign: "center", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none",
                  background: p.highlight ? PRIMARY : "transparent",
                  color: p.highlight ? "white" : PRIMARY_DARK,
                  border: p.highlight ? "none" : `2px solid ${PRIMARY}`,
                }}>{p.cta}</a>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32, display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
            {["⭐ 7-Day Free Trial", "No Setup Fees*", "Cancel Anytime"].map(t => (
              <span key={t} style={{ fontSize: 14, color: "#6b7280", fontWeight: 600 }}>{t}</span>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 12 }}>All paid plans include a 7-day free trial. *Enterprise plan requires custom setup fee. Monthly vendor commitment applies to Starter plan.</p>
        </div>
      </section>

      {/* WEBSITES */}
      <section id="websites" style={{ padding: "100px 24px", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999, background: PRIMARY_LIGHT, color: PRIMARY_DARK, fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
              <Globe size={13} /> Website Redesign
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#111827", marginBottom: 16 }}>Your Frame Shop Deserves Better</h2>
            <div style={{ display: "flex", justifyContent: "center", gap: 36, flexWrap: "wrap", marginTop: 24 }}>
              {[
                { Icon: Zap, label: "90+ Lighthouse Score" },
                { Icon: Smartphone, label: "Mobile-First Design" },
                { Icon: Search, label: "Local SEO" },
                { Icon: ImageIcon, label: "Gallery Showcase" },
              ].map(({ Icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, color: "#374151", fontSize: 14, fontWeight: 600 }}>
                  <Icon size={16} color={PRIMARY} />{label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { name: "Essential", price: "$2,500", tag: "", desc: "Perfect for getting started", features: ["5-page responsive website", "Contact forms & gallery", "Basic SEO setup", "Mobile-first design", "90+ Lighthouse score"] },
              { name: "Professional", price: "$5,000", tag: "Best Value", desc: "For shops ready to grow", features: ["Everything in Essential", "SimpleFrame embedded", "Online quote requests", "Local SEO optimization", "Google Business setup", "30-day support included"] },
              { name: "Premium", price: "$8,500", tag: "", desc: "Full digital transformation", features: ["Everything in Professional", "Custom design & branding", "E-commerce / online store", "API integrations", "Priority 24/7 support", "6-month maintenance"] },
            ].map(p => (
              <div key={p.name} style={{
                background: p.tag ? BG_WARM : "#f9fafb", borderRadius: 20, padding: 32, position: "relative",
                border: p.tag ? `2px solid ${PRIMARY}` : "1px solid #e5e7eb",
                boxShadow: p.tag ? `0 8px 30px rgba(217,119,6,0.12)` : "none"
              }}>
                {p.tag && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: PRIMARY, color: "white", padding: "4px 16px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{p.tag}</div>}
                <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>{p.desc}</div>
                <div style={{ fontSize: 40, fontWeight: 900, color: p.tag ? PRIMARY : "#111827", marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>one-time investment</div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: "flex", gap: 8, fontSize: 14, color: "#374151", alignItems: "center" }}>
                      <CheckCircle size={15} color={PRIMARY} style={{ flexShrink: 0 }} />{f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "13px 0", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none",
                  background: p.tag ? PRIMARY : "transparent",
                  color: p.tag ? "white" : PRIMARY_DARK,
                  border: p.tag ? "none" : `2px solid ${PRIMARY}`,
                }}>Get Free Analysis <ChevronRight size={16} /></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: "80px 24px", background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)` }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "white", marginBottom: 16 }}>Ready to Transform Your Frame Shop?</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 18, marginBottom: 36 }}>Free website audit for any frame shop. No obligation. Just honest advice from someone who knows the industry.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", background: "white", color: PRIMARY_DARK, borderRadius: 12, fontSize: 16, fontWeight: 800, textDecoration: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
              Get Free Audit <ArrowRight size={16} />
            </a>
            <a href="https://simpleframe.app" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", background: "transparent", color: "white", borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: "none", border: "2px solid rgba(255,255,255,0.6)" }}>
              <Play size={16} fill="white" /> Try SimpleFrame
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "100px 24px", background: BG_WARM }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999, background: PRIMARY_LIGHT, color: PRIMARY_DARK, fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
              <Mail size={13} /> Get In Touch
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#111827", marginBottom: 12 }}>Let&apos;s Talk</h2>
            <p style={{ color: "#6b7280", fontSize: 18 }}>Free website analysis for any frame shop. No obligation, no pressure.</p>
          </div>

          {status === "success" ? (
            <div style={{ background: "white", borderRadius: 20, padding: 56, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #d1fae5" }}>
              <CheckCircle size={56} color="#059669" style={{ margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: 26, fontWeight: 800, color: "#059669", marginBottom: 8 }}>Message Sent!</h3>
              <p style={{ color: "#6b7280" }}>We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 20, padding: 40, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name"
                      style={{ width: "100%", padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", color: "#111827", fontFamily: "inherit" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@yourshop.com"
                      style={{ width: "100%", padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", color: "#111827", fontFamily: "inherit" }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Shop / Business Name</label>
                  <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Your Frame Shop"
                    style={{ width: "100%", padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", color: "#111827", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>I&apos;m interested in</label>
                  <select value={form.interest} onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
                    style={{ width: "100%", padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", color: "#111827", background: "white", fontFamily: "inherit" }}>
                    <option>Website Redesign</option>
                    <option>SimpleFrame SaaS</option>
                    <option>Both</option>
                    <option>Just exploring</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us about your shop and what you're looking for..."
                    style={{ width: "100%", padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit", color: "#111827" }} />
                </div>
                {status === "error" && (
                  <p style={{ color: "#dc2626", fontSize: 14, background: "#fef2f2", padding: "10px 14px", borderRadius: 8 }}>
                    Something went wrong. Email us: <a href="mailto:info@buildkind.tech" style={{ color: "#dc2626" }}>info@buildkind.tech</a>
                  </p>
                )}
                <button type="submit" disabled={status === "loading"}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "15px", background: PRIMARY, color: "white", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: status === "loading" ? "not-allowed" : "pointer", opacity: status === "loading" ? 0.7 : 1, boxShadow: "0 4px 14px rgba(217,119,6,0.35)", fontFamily: "inherit" }}>
                  {status === "loading" ? "Sending..." : <><span>Send Message</span><ArrowRight size={16} /></>}
                </button>
              </form>
            </div>
          )}

          <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
            <a href="tel:+14696132763" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}><PhoneCall size={15} color={PRIMARY} /> (469) 613-2763</a>
            <a href="mailto:info@buildkind.tech" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}><Mail size={15} color={PRIMARY} /> info@buildkind.tech</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111827", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ marginBottom: 10 }}>
                <Image src="/assets/buildkind-logo.jpeg" alt="BuildKind Tech" width={120} height={44} style={{ borderRadius: 6, objectFit: "contain", height: 40, width: "auto" }} />
              </div>
              <p style={{ color: "#6b7280", fontSize: 13, maxWidth: 260, lineHeight: 1.7 }}>Empowering Framers with Thoughtful Technology</p>
            </div>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              <div>
                <div style={{ color: "white", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>Products</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a href="https://simpleframe.app" target="_blank" style={{ color: "#6b7280", textDecoration: "none", fontSize: 13 }}>SimpleFrame SaaS</a>
                  <a href="#websites" style={{ color: "#6b7280", textDecoration: "none", fontSize: 13 }}>Website Redesign</a>
                  <a href="#pricing" style={{ color: "#6b7280", textDecoration: "none", fontSize: 13 }}>Pricing</a>
                </div>
              </div>
              <div>
                <div style={{ color: "white", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>Contact</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a href="tel:+14696132763" style={{ color: "#6b7280", textDecoration: "none", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><PhoneCall size={12} /> (469) 613-2763</a>
                  <a href="tel:+18886134093" style={{ color: "#6b7280", textDecoration: "none", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><PhoneCall size={12} /> (888) 613-4093</a>
                  <a href="mailto:info@buildkind.tech" style={{ color: "#6b7280", textDecoration: "none", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Mail size={12} /> info@buildkind.tech</a>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1f2937", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: "#4b5563", fontSize: 12 }}>© 2026 BuildKind Tech LLC. All rights reserved.</p>
            <a href="https://simpleframe.app" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", background: PRIMARY, color: "white", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              <Play size={12} fill="white" /> Try SimpleFrame
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
