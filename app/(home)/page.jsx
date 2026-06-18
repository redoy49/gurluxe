import ShoppableVideos from "@/components/ShoppableVideos";
import HeroSection from "../../components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import CommunityStories from "@/components/CommunityStories";
import NewArrivals from "@/components/NewArrivals";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <NewArrivals />
      <ShoppableVideos />
      <CommunityStories />
    </div>
  );
}
