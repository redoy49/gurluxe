import ShoppableVideos from "@/components/ShoppableVideos";
import HeroSection from "../../components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <ShoppableVideos />
    </div>
  );
}
