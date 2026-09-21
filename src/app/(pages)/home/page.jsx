import React, { useState } from "react";
import { useKalyani } from "../../../context/KalyaniContext";
import FeaturedCarsSection from "../../../components/home/FeaturedCarsSection";
import HeroVideo from "../../../components/home/HeroVideo";
import ChannelExperienceSection from "../../../components/home/ArenavsNexaCTA";
import WhyChooseKalyaniSection from "../../../components/home/WhyChoseUs";
import FaqSection from "../../../components/home/FAQsection";
import NearestBranchesSection from "../../../components/home/NearestBranches";

export default function HomePage() {
  const { cars, locations, selectedCity } = useKalyani();

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
      <NearestBranchesSection locations={locations} selectedCity={selectedCity} />

      {/* 7. Common Customer FAQs Accordion */}
      <FaqSection />
    </div>
  );
}