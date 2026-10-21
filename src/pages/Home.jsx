import { useState } from "react";
import { usePageMeta } from "../lib/usePageMeta";
import Hero from "../components/Hero";
import TrustBar from "../components/TrustBar";
import Rentals from "../components/Rentals";
import HowItWorks from "../components/HowItWorks";
import DeliveryNotice from "../components/DeliveryNotice";
import About from "../components/About";
import WhyChooseUs from "../components/WhyChooseUs";
// Hidden for now — re-add the <Certifications /> render below to bring it back.
// import Certifications from "../components/Certifications";
import Gallery from "../components/Gallery";
import Partners from "../components/Partners";
import Reviews from "../components/Reviews";
import QuoteForm from "../components/QuoteForm";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";
import FinalCTA from "../components/FinalCTA";

export default function Home() {
  const [prefillInterest, setPrefillInterest] = useState("");

  usePageMeta({
    title: "Amazing Grace Travels, Events & Rentals by MRC | Oahu Event Rentals",
    description:
      "Affordable event rentals and personalized packages in Oahu, Hawaii. Amazing Grace Travels, Events and Rentals by MRC is a family-owned business helping you celebrate life's special moments.",
    path: "/",
  });

  return (
    <>
      <DeliveryNotice />
      <Hero />
      <TrustBar />
      <Rentals onSelectInterest={setPrefillInterest} />
      <HowItWorks />
      <About />
      <WhyChooseUs />
      {/* <Certifications /> */}
      <Gallery />
      <Partners />
      <Reviews />
      <QuoteForm prefillInterest={prefillInterest} />
      <FAQ />
      <Contact />
      <FinalCTA />
    </>
  );
}
