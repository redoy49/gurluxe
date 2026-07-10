import ShoppableVideos from "@/components/ShoppableVideos";
import HeroSection from "../../components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import CommunityStories from "@/components/CommunityStories";
import NewArrivals from "@/components/NewArrivals";
import BestSellers from "@/components/BestSellers";
import { getFeaturedProducts } from "@/lib/queries/products";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts products={featuredProducts} />
      <NewArrivals />
      <BestSellers />
      <ShoppableVideos />
      <CommunityStories />
    </div>
  );
}
