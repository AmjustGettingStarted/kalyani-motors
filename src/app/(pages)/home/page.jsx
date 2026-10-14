import React, { useState, useEffect } from "react";
import { useKalyani } from "../../../context/KalyaniContext";
import useOutlets from "../../../components/hooks/useOutlets";
import FeaturedCarsSection from "../../../components/home/FeaturedCarsSection";
import HeroVideo from "../../../components/home/HeroVideo";
import ChannelExperienceSection from "../../../components/home/ArenavsNexaCTA";
import WhyChooseKalyaniSection from "../../../components/home/WhyChoseUs";
import FaqSection from "../../../components/home/FAQsection";
import NearestBranchesSection from "../../../components/home/NearestBranches";
import EnquiryPopupModal from "../../../components/widgets/EnquiryPopupModal";

export default function HomePage() {
  const { cars, selectedCity } = useKalyani();
  const { data: allOutlets = [] } = useOutlets();

  const cityKey = selectedCity?.toLowerCase() || "bengaluru";
  const cityLocations = allOutlets.filter((outlet) => {
    const oCity = outlet.city?.toLowerCase() || "";
    if (cityKey === "bengaluru" || cityKey === "bangalore") {
      return oCity === "bengaluru" || oCity === "bangalore";
    }
    if (cityKey === "hyderabad" || cityKey === "hydrabad") {
      return oCity === "hyderabad" || oCity === "hydrabad";
    }
    return oCity === cityKey;
  });
  const nearestBranches = cityLocations.slice(0, 3);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  useEffect(() => {
    // 10 second delay for Enquiry popup
    const timer = setTimeout(() => {
      const isDismissed = sessionStorage.getItem("kalyani_enquiry_dismissed");
      if (!isDismissed) {
        setShowEnquiryModal(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseEnquiry = () => {
    setShowEnquiryModal(false);
    sessionStorage.setItem("kalyani_enquiry_dismissed", "true");
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Banner Carousel */}
      <HeroVideo />

      {/* 3. Featured Car Showcase with Filter Pills & Responsive Carousel */}
      <FeaturedCarsSection cars={cars} selectedCity={selectedCity} />

      {/* 4. Arena vs Nexa Channel Experience Strip */}
      <ChannelExperienceSection />

      {/* 5. Why Choose Kalyani Motors (Trust Badges & Milestones) */}
      <WhyChooseKalyaniSection />

      {/* 6. City Outlets Spotlight */}
      <NearestBranchesSection locations={nearestBranches} selectedCity={selectedCity} />

      {/* 7. Common Customer FAQs Accordion */}
      <FaqSection />

      {/* 8. Premium Timed Enquiry Modal (10s delay) */}
      <EnquiryPopupModal
        isOpen={showEnquiryModal}
        onClose={handleCloseEnquiry}
      />
    </div>
  );
}