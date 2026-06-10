import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-pink-50">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(244,114,182,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(244,114,182,0.08)_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Blur Gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[10%] h-105 w-105 rounded-full bg-pink-300/40 blur-[120px]" />

        <div className="absolute right-[-10%] top-[20%] h-105 w-105 rounded-full bg-rose-300/40 blur-[120px]" />

        <div className="absolute left-1/2 top-[-10%] h-95 w-95 -translate-x-1/2 rounded-full bg-fuchsia-200/30 blur-[120px]" />
      </div>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <LoginForm />
      </section>
    </main>
  );
}
