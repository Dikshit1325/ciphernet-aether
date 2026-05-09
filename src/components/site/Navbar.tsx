import { Link } from "@tanstack/react-router";
import { Shield, Search, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { auth } from "@/firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";

const navLinks = [
  { to: "/threat-intelligence", label: "Threat Intelligence" },
  { to: "/url-protection", label: "URL Protection" },
  { to: "/scam-detection", label: "Scam Detection" },
  { to: "/deepfake-defense", label: "Deepfake Defense" },
  { to: "/browser-shield", label: "Browser Shield" },
  { to: "/trust-engine", label: "AI Trust Engine" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Signed out");
      setMenuOpen(false);
      // optional: redirect to home
      window.location.href = "/";
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Sign out failed");
    }
  };
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 backdrop-blur-xl bg-background/60 border-b border-border/40" />
      <nav className="relative mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-purple grid place-items-center shadow-[0_0_20px_oklch(0.78_0.18_220_/_0.5)]">
            <Shield className="h-4 w-4 text-background" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-display font-semibold text-sm tracking-tight">
              CipherNet<span className="text-cyber-cyan">.AI</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Cyber Defense OS</div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="relative px-3 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors group"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
              <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-gradient-to-r from-cyber-cyan to-cyber-purple scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button className="p-2 rounded-md hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-secondary/60 transition"
                aria-label="Account"
                type="button"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple grid place-items-center text-sm font-semibold text-background">
                  {(user.displayName && user.displayName[0]) || user.email?.[0] || "U"}
                </div>
                <span className="text-sm font-medium text-muted-foreground">{user.displayName || user.email}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-lg border border-border/40 bg-background p-2 shadow-lg">
                  <Link to="/threat-intelligence" className="block px-3 py-2 text-sm text-muted-foreground hover:bg-background/50 rounded">Dashboard</Link>
                  <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-background/50 rounded">Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/sign-in" className="text-[13px] font-medium text-muted-foreground hover:text-foreground px-3 py-2">Sign In</Link>
              <Link to="/sign-up" className="text-[13px] font-medium text-muted-foreground hover:text-foreground px-3 py-2">Sign Up</Link>
            </>
          )}
          <Link to="/threat-intelligence" className="text-[13px] font-medium px-3 py-2 rounded-md border border-border/60 hover:border-cyber-cyan/50 hover:text-cyber-cyan transition">
            Dashboard
          </Link>
          <Link
            to="/url-protection"
            className="text-[13px] font-semibold px-4 py-2 rounded-md bg-gradient-to-r from-cyber-cyan to-cyber-blue text-background shadow-[0_0_24px_oklch(0.78_0.18_220_/_0.45)] hover:shadow-[0_0_32px_oklch(0.78_0.18_220_/_0.7)] transition-all"
          >
            Live Demo
          </Link>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden relative glass-strong border-t border-border/40 px-6 py-4 flex flex-col gap-1">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 text-sm text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <div className="py-2 text-sm text-muted-foreground">Signed in as</div>
              <div className="py-2 text-sm font-medium">{user.displayName || user.email}</div>
              <button type="button" onClick={handleSignOut} className="py-2 text-sm text-muted-foreground hover:text-foreground text-left">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/sign-in" onClick={() => setOpen(false)} className="py-2 text-sm text-muted-foreground hover:text-foreground">
                Sign In
              </Link>
              <Link to="/sign-up" onClick={() => setOpen(false)} className="py-2 text-sm text-muted-foreground hover:text-foreground">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
