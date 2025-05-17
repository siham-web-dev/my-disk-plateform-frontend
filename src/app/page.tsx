import FeaturesSection from "@/components/custom/FeaturesSection";
import Footer from "@/components/custom/Footer";
import HeroSection from "@/components/custom/heroSection";
import Navbar from "@/components/custom/navbar";
import PricingSection from "@/components/custom/PricingSection";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
