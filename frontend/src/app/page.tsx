"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ThreeJSOrb from "@/components/ThreeJSOrb";
import SignInButton from "@/components/SignInButton";
import { MessageSquare, Zap, Shield, Sparkles } from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden selection:bg-neon-purple/30">

      {/* Background ambient glowing mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8b5cf6]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#3b82f6]/20 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto glass rounded-b-3xl sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Sparkles className="text-[#8b5cf6]" />
            <span className="font-bold text-xl tracking-tight">NeuroChat<span className="text-[#8b5cf6]">.ai</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#demo" className="hover:text-white transition-colors">Demo</Link>
          </div>
          <div className="flex items-center gap-4">
            <SignInButton />
            <Link href="/chat" className="px-5 py-2 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-medium text-sm button-glow hover:scale-105 transition-transform duration-300">
              Launch App
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-[#8b5cf6]/30 text-xs text-[#8b5cf6] w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8b5cf6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8b5cf6]"></span>
              </span>
              GPT-4o Integration Live
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter">
              Meet the next <br />
              evolution in <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] glow-text">
                Intelligence.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
              Experience extremely fluid conversations, document intelligence, and advanced memory in a beautifully crafted workspace.
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-4 items-center pt-4">
              <Link href="/chat" className="px-8 py-4 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                Start Chatting <Zap size={18} />
              </Link>
              <Link href="#demo" className="px-8 py-4 rounded-full glass font-medium hover:bg-white/5 transition-colors">
                Watch Demo
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            {/* Interactive 3D element */}
            <ThreeJSOrb />
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#8b5cf6]/50 to-transparent" />

          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Engineered for the Future</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">A pristine intersection of minimalist design and maximum capability.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Zap className="text-[#3b82f6]" />}
              title="Real-time Streaming"
              description="Lightning-fast token streaming directly from Next-Gen LLMs to your screen."
            />
            <FeatureCard
              icon={<MessageSquare className="text-[#8b5cf6]" />}
              title="Infinite Memory"
              description="Context-aware conversations that remember what you said 10 messages ago."
            />
            <FeatureCard
              icon={<Shield className="text-[#ec4899]" />}
              title="Secure Workspace"
              description="Enterprise-grade data protection with JWT authentication and secure enclaves."
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
