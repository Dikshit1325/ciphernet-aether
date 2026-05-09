import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Eye, Lock, Mail, Shield, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { auth } from "@/firebase";
import { signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { PageShell, Panel } from "@/components/site/PageShell";
import { AuthBackdrop } from "@/components/auth/AuthBackdrop";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign In — CipherNet AI" },
      {
        name: "description",
        content: "Sign in to CipherNet AI to access cyber threat intelligence and AI defense tools.",
      },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const getAuthErrorMessage = (code?: string) => {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Invalid email or password.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait and try again.";
      case "auth/operation-not-allowed":
        return "Email/password sign-in is disabled in Firebase Authentication.";
      default:
        return "Sign in failed. Please try again.";
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error("Enter email and password.");
      return;
    }

    setBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      await user.reload();
      if (!user.emailVerified) {
        // resend verification link
        await sendEmailVerification(user);
        await signOut(auth);
        toast.error("Email not verified. Verification email resent.");
        return;
      }

      // authenticated and verified — redirect to dashboard
      toast.success("Signed in.");
      window.location.href = "/zero-trust";
    } catch (err: any) {
      console.error(err);
      toast.error(getAuthErrorMessage(err?.code));
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell
      eyebrow="Secure Access"
      title={
        <>
          Sign in to <span className="text-gradient-cyber">CipherNet AI</span>
        </>
      }
      subtitle="Enter your credentials to access the live threat console, trust engine, and enterprise cyber intelligence dashboard."
    >
      <div className="grid gap-6 lg:grid-cols-2 items-stretch">
        <AuthBackdrop
          title="Enterprise-grade threat operations access"
          subtitle="Authenticate into the AI cyber defense platform used to monitor URLs, scams, deepfakes, and live threat intelligence in real time."
          metricLabel="Protected sessions"
          metricValue="24/7"
        />

        <Panel
          title="Account Login"
          action={<Shield className="h-4 w-4 text-cyber-cyan" />}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none cyber-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          <div className="relative space-y-5">
            <div className="flex items-center gap-2 rounded-2xl border border-cyber-cyan/20 bg-cyber-cyan/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyber-cyan">
              <Sparkles className="h-3.5 w-3.5" />
              Trusted access gateway
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Email
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-4 py-3 focus-within:border-cyber-cyan/60 transition-colors">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                  placeholder="security@company.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-4 py-3 focus-within:border-cyber-cyan/60 transition-colors">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-muted-foreground hover:text-cyber-cyan transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-border/60 bg-transparent" />
                Remember this device
              </label>
              <a href="#" className="hover:text-cyber-cyan transition">
                Forgot password?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={handleSignIn}
              disabled={busy}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue px-4 py-3 text-sm font-semibold text-background shadow-[0_0_30px_oklch(0.78_0.18_220_/_0.45)] transition-all disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign In"}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>

            <div className="rounded-2xl border border-border/50 bg-background/30 p-4 text-sm text-muted-foreground">
              Access the live threat console, automated verdicts, and real-time intelligence feed from one secure session.
            </div>

            <p className="text-center text-sm text-muted-foreground">
              New to CipherNet?{" "}
              <Link to="/sign-up" className="font-semibold text-cyber-cyan hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
