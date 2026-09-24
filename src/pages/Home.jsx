import { useState } from "react";
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
import Reviews from "../components/Reviews";
import QuoteForm from "../components/QuoteForm";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";
import FinalCTA from "../components/FinalCTA";

export default function Home() {
  const [prefillInterest, setPrefillInterest] = useState("");

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
      <Reviews />
      <QuoteForm prefillInterest={prefillInterest} />
      <FAQ />
      <Contact />
      <FinalCTA />
    </>
  );
}
