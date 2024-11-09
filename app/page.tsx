import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Features from "@/components/Features"

export default function Home() {
  return (
    <div className="bg-neutral-200">
        <div className="absolute top-0 left-0 w-full">
          <Navbar />
        </div>
        <Hero />
        <Features />
    </div>
  )
}