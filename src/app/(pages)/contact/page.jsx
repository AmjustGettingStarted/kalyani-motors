import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockLocations } from "../../../data/mockLocations";
import useHeader from "../../../components/hooks/useHeader";
import {
  Car,
  Settings,
  GraduationCap,
  MapPin,
  Phone,
  ArrowRight,
  ArrowDown,
  ChevronDown,
  Building2,
} from "lucide-react";
import { useKalyani } from "../../../context/KalyaniContext";

const TABS = [
  { name: "Commercial", category: "commercial", icon: Building2 },
  {
    name: "Arena",
    category: "arena",
    icon: Car,
    subOptions: ["Sales", "Service"],
  },
  {
    name: "Nexa",
    category: "nexa",
    icon: Settings,
    subOptions: ["Sales", "Service"],
  },
  { name: "True Value", category: "truevalue", icon: Settings },
  { name: "Driving School", category: "driving-school", icon: GraduationCap },
];

const SUB_ICONS = {
  Sales: Car,
  Service: Settings,
};

export default function AnimatedOutlets() {
  const [activeTab, setActiveTab] = useState("Arena");
  const [activeSubType, setActiveSubType] = useState("Sales");

  // Header state
  const { isHidden } = useHeader();

  // Pull the current city from your context (e.g., 'bengaluru', 'hyderabad')
  const { selectedCity } = useKalyani();

  const cityKey = selectedCity?.toLowerCase() || "bengaluru";
  const locationsForCity = mockLocations[cityKey] || [];

  const currentTabInfo = TABS.find((t) => t.name === activeTab);
  const hasSub = !!currentTabInfo?.subOptions;

  const filteredOutlets = locationsForCity.filter((outlet) => {
    if (outlet.category !== currentTabInfo.category) return false;
    if (hasSub && outlet.type !== activeSubType) return false;
    return true;
  });

  const isOdd = filteredOutlets.lenght % 2 !== 0;

  const handleSelectTab = (tab) => {
    setActiveTab(tab.name);
    setActiveSubType(tab.subOptions ? tab.subOptions[0] : null);
  };

  const handleSelectSub = (tab, subOption) => {
    setActiveTab(tab.name);
    setActiveSubType(subOption);
  };

  return (
    <>
      <div className="min-h-screen lg:mx-24 bg-[#f8fafc] text-slate-900 font-sans">
        <div className="max-w-full px-8 pb-6 pt-20">
          {/* Desktop Navigation */}
          <div
            className={`sticky z-40 flex justify-center transition-all duration-300 ${isHidden ? "top-4" : "top-20"}`}
          >
            <div className="hidden md:inline-flex w-full justify-between items-center bg-white p-1.5 rounded-full shadow-sm border border-slate-200">
              {TABS.map((tab) => (
                <TabButton
                  key={tab.name}
                  tab={tab}
                  isActive={activeTab === tab.name}
                  activeSubType={activeSubType}
                  onSelectTab={handleSelectTab}
                  onSelectSub={handleSelectSub}
                />
              ))}
            </div>
          </div>
          {/* Mobile View */}
          <div
            className={`md:hidden sticky z-40 flex justify-start transition-all duration-300 pt-8 ${isHidden ? "top-0" : "top-24"
              }`}
          >
            <MobileFilterDropdown
              activeTab={activeTab}
              activeSubType={activeSubType}
              onSelectTab={handleSelectTab}
              onSelectSub={handleSelectSub}
            />
          </div>

          {/* SECTION LABEL */}
          <div className="text-center">
            <p className="text-sm font-bold tracking-[0.2em] text-slate-800 uppercase pt-6 p-3">
              Our Outlets in {selectedCity}
            </p>
          </div>

          {/* ROAD + CARDS */}
          <div className="relative">
            {/* Central dashed road line — hidden on mobile, where cards stack in one column */}
            <div className="hidden md:flex justify-between absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-20 z-0">
              <div className="w-px border-l-2 border border-slate-300" />
              <div className="w-px border-l-2 border-dashed border-slate-300" />
              <div className="w-px border-l-2 border border-slate-300" />
            </div>
            {/* Mobile: line runs down the left edge instead */}
            <div className="md:hidden absolute left-4 top-0 bottom-0 w-px border-l-2 border-dashed border-slate-300 z-0" />

            {/* Sticky car marker riding the road */}
            <div className="hidden md:flex sticky top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#f8fafc] items-center justify-center z-10 text-slate-500">
              <Car className="w-5 h-5" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${activeSubType}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="relative z-0 "
              >
                {filteredOutlets.length > 0 ? (
                  <>
                    {/* Mobile Card */}
                    <div className="md:hidden flex flex-col gap-10 pl-12 pb-6">
                      {filteredOutlets.map((outlet, index) => (
                        <OutletCard
                          key={outlet.id}
                          outlet={outlet}
                          index={index}
                          side="right"
                        />
                      ))}
                    </div>

                    {/* desktop card */}
                    <div className="hidden md:grid grid-cols-2 gap-x-48">
                      {/* LEFT HALF */}
                      <div className="flex flex-col gap-14 pt-32">
                        {filteredOutlets
                          .filter((_, index) => index % 2 === 1)
                          .map((outlet, index) => (
                            <OutletCard
                              key={outlet.id}
                              outlet={outlet}
                              index={index * 2 + 1}
                              side="left"
                            />
                          ))}
                      </div>

                      {/* RIGHT HALF */}
                      <div
                        className={`flex flex-col gap-14 ${isOdd ? "" : "pb-32"}`}
                      >
                        {filteredOutlets
                          .filter((_, index) => index % 2 === 0)
                          .map((outlet, index) => (
                            <OutletCard
                              key={outlet.id}
                              outlet={outlet}
                              index={index * 2}
                              side="right"
                            />
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-slate-500 text-center bg-white rounded-2xl border border-slate-200">
                    No {activeSubType || activeTab} outlets found in{" "}
                    {selectedCity}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

function MobileFilterDropdown({
  activeTab,
  activeSubType,
  onSelectTab,
  onSelectSub,
}) {
  const [open, setOpen] = useState(false);

  const currentTab = TABS.find((tab) => tab.name === activeTab);

  const currentLabel = currentTab?.subOptions
    ? `${activeTab} — ${activeSubType}`
    : activeTab;

  return (
    <div className="relative w-[240px]">
      {/* Selected filter */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 px-5 py-3 bg-white rounded-full border border-slate-200 shadow-sm text-sm font-semibold text-slate-800"
      >
        <span className="truncate">{currentLabel}</span>

        <ChevronDown
          className={`w-4 h-4 shrink-0 text-slate-500 transition-transform duration-300 ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.97,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden z-50"
          >
            <div className="p-1.5">
              {TABS.map((tab) => {
                const Icon = tab.icon || Car;

                // Tabs without sub-options
                if (!tab.subOptions) {
                  const isActive = activeTab === tab.name;

                  return (
                    <button
                      key={tab.name}
                      onClick={() => {
                        onSelectTab(tab);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-colors ${isActive
                        ? "bg-slate-800 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />

                      <span>{tab.name}</span>
                    </button>
                  );
                }

                // Tabs with Sales / Service
                return (
                  <div key={tab.name}>
                    {/* Parent */}
                    <div className="flex items-center gap-3 px-4 pt-3 pb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                      <Icon className="w-4 h-4" />
                      {tab.name}
                    </div>

                    {/* Sub options */}
                    {tab.subOptions.map((option) => {
                      const isActive =
                        activeTab === tab.name && activeSubType === option;

                      return (
                        <button
                          key={`${tab.name}-${option}`}
                          onClick={() => {
                            onSelectSub(tab, option);
                            setOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-2.5 pl-11 rounded-xl text-left text-sm transition-colors ${isActive
                            ? "bg-slate-100 text-slate-900 font-semibold"
                            : "text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ tab, isActive, activeSubType, onSelectTab, onSelectSub }) {
  const [open, setOpen] = useState(false);
  const Icon = tab.icon || Car;
  const hasSub = !!tab.subOptions;

  return (
    <div
      className="relative"
      onMouseEnter={() => hasSub && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => {
          onSelectTab(tab);
          if (hasSub) setOpen((o) => !o);
        }}
        className="relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold"
      >
        {isActive && (
          <motion.div
            layoutId="active-tab"
            className="absolute inset-0 bg-slate-800 rounded-full shadow-md"
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
            }}
          />
        )}

        <Icon
          className={`relative z-10 w-4 h-4 ${isActive ? "text-white" : "text-slate-500"
            }`}
        />

        <span
          className={`relative z-10 ${isActive ? "text-white" : "text-slate-600"
            }`}
        >
          {tab.name}
        </span>

        {hasSub && (
          <ChevronDown
            className={`relative z-10 w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""
              } ${isActive ? "text-white" : "text-slate-400"}`}
          />
        )}
      </button>

      <AnimatePresence>
        {hasSub && open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 min-w-[180px] z-20 overflow-hidden"
          >
            {tab.subOptions.map((option) => {
              const SubIcon = SUB_ICONS[option] || Settings;
              const isSubActive = isActive && activeSubType === option;
              return (
                <button
                  key={option}
                  onClick={() => {
                    onSelectSub(tab, option);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm transition-colors ${isSubActive
                    ? "bg-slate-50 text-slate-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <SubIcon
                    className={`w-4 h-4 ${isSubActive ? "text-slate-700" : "text-slate-400"}`}
                  />
                  {option}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OutletCard({ outlet, index, side }) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800";
  const isLeft = side === "left";

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: isLeft ? 40 : -40,
        y: 15,
        scale: 0.96,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        margin: "-80px",
      }}
      transition={{
        duration: 0.65,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative"
    >
      {/* Connector dot back to the road (desktop only) */}
      <div
        className={`block absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-[#f8fafc] bg-slate-700 z-10 shadow-sm ${isLeft ? "-right-[41px]" : "-left-[41px]"
          }`}
      />
      {/* Card Container */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300">
        {/* Image Box */}
        <div className="w-full h-40 rounded-xl overflow-hidden shrink-0 bg-slate-100">
          <img
            src={outlet.image || fallbackImage}
            alt={outlet.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content Box */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h3 className="font-bold text-base text-slate-900 leading-tight">
              {outlet.name}
            </h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              {outlet.address}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-5">
              <a
                href={`tel:${outlet.phone}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors"
              >
                <Phone className="w-4 h-4" /> Call
              </a>
              <a
                href={outlet.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors"
              >
                <MapPin className="w-4 h-4" /> Directions
              </a>
            </div>

            <button className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-800 hover:text-blue-950 transition-colors group">
              Contact Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
