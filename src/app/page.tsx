import FeaturesSection from "@/components/custom/FeaturesSection";
import HeroSection from "@/components/custom/heroSection";
import Navbar from "@/components/custom/navbar";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
