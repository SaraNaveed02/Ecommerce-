import Image from "next/image";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import ScrollBanner from "./components/ScrollBanner";
import HomeProductPage from "./productsSection/HomeProductPage"
import Footer from "./components/Footer";

export default function Home() {
  return (
   <div>
    <ScrollBanner/>
    <Navbar/>
    <HeroSection/>
    <HomeProductPage/>
    <Footer/></div>

  );
}
