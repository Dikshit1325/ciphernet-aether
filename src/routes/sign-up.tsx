import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Lock,
  Mail,
  User,
  Shield,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { PageShell, Panel } from "@/components/site/PageShell";
import { AuthBackdrop } from "@/components/auth/AuthBackdrop";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [
      { title: "Sign Up — CipherNet AI" },
      {
        name: "description",
        content: "Create your CipherNet AI account to access enterprise cyber defense tools and live threat intelligence.",
      },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [created, setCreated] = useState(false);
  const [busy, setBusy] = useState(false);

  const getAuthErrorMessage = (code?: string) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already in use. Try signing in.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password is too weak. Use at least 6 characters.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait and try again.";
      case "auth/operation-not-allowed":
        return "Email/password sign-up is disabled in Firebase Authentication.";
      case "auth/invalid-continue-uri":
      case "auth/unauthorized-continue-uri":
        return "Verification link domain is not authorized in Firebase.";
      default:
        return "Signup failed. Please try again.";
    }
  };

  const handleCreateAccount = async () => {
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      await updateProfile(user, { displayName: name });

      // Send verification first so Firestore rules cannot block email delivery.
      await sendEmailVerification(user);

      // Firestore profile is useful but should not block auth flow.
      try {
        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          uid: user.uid,
          createdAt: serverTimestamp(),
        });
      } catch (firestoreErr) {
        console.error("Profile save failed:", firestoreErr);
        toast.warning("Account created, but profile sync failed. You can continue.");
      }

      await signOut(auth);

      setCreated(true);
      toast.success("Account created — verification email sent.");
    } catch (err: any) {
      console.error(err);
      toast.error(getAuthErrorMessage(err?.code));
    } finally {
      setBusy(false);
    }
  };

  const handleResendVerification = async () => {
    setBusy(true);
    try {
      // sign in temporarily to resend
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      await sendEmailVerification(user);
      await signOut(auth);
      toast.success("Verification email resent.");
    } catch (err: any) {
      console.error(err);
      toast.error(getAuthErrorMessage(err?.code));
    } finally {
      setBusy(false);
    }
  };

  const handleIHaveVerified = async () => {
    setBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      await user.reload();
      if (user.emailVerified) {
        toast.success("Email verified — you can sign in now.");
        window.location.href = "/sign-in";
      } else {
        toast.error("Email not verified yet. Please check your inbox.");
        await signOut(auth);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(getAuthErrorMessage(err?.code));
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell
      eyebrow="Create Account"
      title={
        <>
          Join <span className="text-gradient-cyber">CipherNet AI</span>
        </>
      }
      subtitle="Create your security workspace to monitor threats, run AI analysis, and protect your users with enterprise-grade cyber intelligence."
    >
      <div className="grid gap-6 lg:grid-cols-2 items-stretch">
        <AuthBackdrop
          title="Build your threat operations workspace"
          subtitle="Launch into a cyber defense dashboard with URL analysis, scam detection, live intelligence feeds, and trust scoring in one unified platform."
          metricLabel="Deployment readiness"
          metricValue="Instant"
        />

        <Panel
          title="Create Account"
          action={<Shield className="h-4 w-4 text-cyber-cyan" />}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none cyber-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          <div className="relative space-y-5">
            <div className="flex items-center gap-2 rounded-2xl border border-cyber-cyan/20 bg-cyber-cyan/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyber-cyan">
              <Sparkles className="h-3.5 w-3.5" />
              Secure account creation
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Name
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-4 py-3 focus-within:border-cyber-cyan/60 transition-colors">
                <User className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
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
                  placeholder="Create a password"
                  autoComplete="new-password"
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

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Confirm Password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-4 py-3 focus-within:border-cyber-cyan/60 transition-colors">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="text-muted-foreground hover:text-cyber-cyan transition"
                  aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-cyber-cyan/20 bg-cyber-cyan/5 px-4 py-3 text-xs text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyber-green" />
              <span>
                Your account will unlock URL protection, scam detection, live intelligence, and AI threat verdicts.
              </span>
            </div>

            {!created ? (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={handleCreateAccount}
                disabled={busy}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue px-4 py-3 text-sm font-semibold text-background shadow-[0_0_30px_oklch(0.78_0.18_220_/_0.45)] transition-all disabled:opacity-60"
              >
                {busy ? "Creating…" : "Create Account"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  A verification email was sent to <strong>{email}</strong>. Please check your inbox and click the verification link. After verifying, use the button below.
                </p>
                <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleIHaveVerified}
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyber-green/90 px-4 py-2 text-sm font-semibold text-background"
                  >
                    I have verified
                  </button>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground"
                  >
                    Resend verification
                  </button>
                </div>
              </div>
            )}

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/sign-in" className="font-semibold text-cyber-cyan hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
