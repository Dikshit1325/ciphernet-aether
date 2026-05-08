import { Link } from "@tanstack/react-router";
import { Shield, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border/40 bg-background/40 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-6 py-16 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-purple grid place-items-center">
              <Shield className="h-4 w-4 text-background" strokeWidth={2.5} />
            </div>
            <span className="font-display font-semibold text-lg">CipherNet<span className="text-cyber-cyan">.AI</span></span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            The unified AI-powered cyber defense ecosystem for the modern internet — built for enterprises, trusted by analysts.
          </p>
          <div className="flex gap-3 pt-2">
            {[Github, Twitter, Linkedin].map((I, i) => (
              <a key={i} href="#" className="h-9 w-9 grid place-items-center rounded-md border border-border/60 hover:border-cyber-cyan/60 hover:text-cyber-cyan transition">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: "Platform", links: [["Threat Intelligence","/threat-intelligence"],["URL Protection","/url-protection"],["Scam Detection","/scam-detection"],["Deepfake Defense","/deepfake-defense"]] },
          { title: "Solutions", links: [["Browser Shield","/browser-shield"],["AI Trust Engine","/trust-engine"],["Enterprise","/"],["API Access","/"]] },
          { title: "Company", links: [["About","/"],["Security","/"],["Compliance","/"],["Contact","/"]] },
        ].map((c) => (
          <div key={c.title}>
            <div className="text-[11px] uppercase tracking-[0.2em] text-cyber-cyan/80 mb-4">{c.title}</div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {c.links.map(([l, to]) => (
                <li key={l}><Link to={to as string} className="hover:text-foreground transition">{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/40">
        <div className="mx-auto max-w-[1400px] px-6 py-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} CipherNet AI — Cyber Defense Operating System</div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyber-green pulse-dot text-cyber-green" />
            <span>All systems operational • SOC2 • ISO 27001</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
