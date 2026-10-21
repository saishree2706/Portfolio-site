"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMode } from "@/context/ModeContext";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollBird from "@/components/ScrollBird";
import IndiaHUDBackground from "@/components/IndiaHUDBackground";
import PaletteSwitcher from "@/components/PaletteSwitcher";

// Profession mode sections
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Interests from "@/components/sections/Interests";
import Contact from "@/components/sections/Contact";

// Passion mode sections
import CreativeHero from "@/components/creative/CreativeHero";
import ReelsSection from "@/components/creative/ReelsSection";
import YouTubeSection from "@/components/creative/YouTubeSection";
import CreativeContact from "@/components/creative/CreativeContact";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

export default function Home() {
  const { mode } = useMode();
  const isPassion = mode === "passion";

  return (
    <main className={isPassion ? "relative grain" : "relative"}>
      {isPassion && <IndiaHUDBackground />}
      {isPassion && <PaletteSwitcher />}
      <ScrollProgress />
      <ScrollBird />
      <Navbar />
      <AnimatePresence mode="wait">
        {!isPassion ? (
          <motion.div key="profession" variants={fade} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Interests />
            <Contact />
          </motion.div>
        ) : (
          <motion.div key="passion" variants={fade} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }} className="relative" style={{ zIndex: 2 }}>
            <CreativeHero />
            <YouTubeSection />
            <ReelsSection />
            <CreativeContact />
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </main>
  );
}
