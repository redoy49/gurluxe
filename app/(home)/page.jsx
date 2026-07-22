import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewArrivals from "@/components/NewArrivals";
import BestSellers from "@/components/BestSellers";
import ShoppableVideos from "@/components/ShoppableVideos";
import CommunityStories from "@/components/CommunityStories";

import {
  getFeaturedProducts,
  getNewArrivalProducts,
  getBestSellerProducts,
} from "@/lib/queries/products";

export default async function Home() {
  const [featuredProducts, newArrivalProducts, bestSellerProducts] =
    await Promise.all([
      getFeaturedProducts(),
      getNewArrivalProducts(),
      getBestSellerProducts(),
    ]);

  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts products={featuredProducts} />
      <NewArrivals products={newArrivalProducts} />
      <BestSellers products={bestSellerProducts} />
      <ShoppableVideos />
      <CommunityStories />
    </div>
  );
}
