import ShoppableVideos from "@/components/ShoppableVideos";
import HeroSection from "../../components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <ShoppableVideos />
    </div>
  );
}
