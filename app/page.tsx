"use client";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import LotterySection from "@/components/LotterySection";
import Navbar from "@/components/Navbar";

export default function Home() {
    return (
        <main className="h-[calc(100vh+320px)] sm:h-[calc(100vh-60px)] w-full bg-gray-100">
            <Navbar />
            <AboutSection />
            <LotterySection />
            <Footer />
        </main>
    );
}
