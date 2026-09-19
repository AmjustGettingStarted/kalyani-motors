export const mockServices = {
  heroImages: [
    {
      id: "hero-1",
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85",
      alt: "Car on road",
    },
    {
      id: "hero-2",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85",
      alt: "Luxury car",
    },
    {
      id: "hero-3",
      image:
        "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=85",
      alt: "Car front",
    },
    {
      id: "hero-4",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=85",
      alt: "Red car",
    },
    {
      id: "hero-5",
      image:
        "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1400&q=85",
      alt: "Car driving",
    },
    {
      id: "hero-6",
      image:
        "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1400&q=85",
      alt: "Car exterior",
    },
    {
      id: "hero-7",
      image:
        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=85",
      alt: "Car detail",
    },
  ],

  services: [
    {
      id: "service-periodic",
      title: "Periodic Service",
      shortTitle: "Periodic",
      category: "Maintenance",
      image:
        "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=1200&q=85",
      description:
        "Keep your vehicle performing at its best with manufacturer-recommended periodic maintenance.",
      points: [
        "Engine oil & filter replacement",
        "Brake inspection",
        "Tyre & wheel inspection",
        "Battery health check",
        "Complete vehicle diagnostics",
      ],
    },
    {
      id: "service-express",
      title: "Express Service",
      shortTitle: "Express",
      category: "Maintenance",
      image:
        "https://images.unsplash.com/photo-1632823471565-1ecdf5c58f4b?auto=format&fit=crop&w=1200&q=85",
      description:
        "Routine maintenance completed through a dedicated multi-technician service bay.",
      points: [
        "Dedicated service bay",
        "Multiple technicians",
        "Live service updates",
        "Priority workflow",
        "Reduced waiting time",
      ],
    },
    {
      id: "service-doorstep",
      title: "Doorstep Service",
      shortTitle: "Doorstep",
      category: "Convenience",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=85",
      description:
        "Professional vehicle care brought directly to your home or workplace.",
      points: [
        "Home or office service",
        "Certified technicians",
        "Convenient scheduling",
        "Routine maintenance",
        "Minimal travel required",
      ],
    },
  ],

  care: [
    {
      id: "care-body",
      title: "Body & Paint Care",
      shortTitle: "Body & Paint",
      category: "Protection",
      image:
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=85",
      description:
        "Restore and protect your vehicle with professional body repair and paint care.",
      points: [
        "Accidental repairs",
        "Dent removal",
        "Paint restoration",
        "Factory finish",
        "Insurance assistance",
      ],
    },
    {
      id: "care-interior",
      title: "Interior Care",
      shortTitle: "Interior",
      category: "Care",
      image:
        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=85",
      description:
        "Give your cabin a fresh, clean and comfortable environment.",
      points: [
        "Deep interior cleaning",
        "Seat & upholstery care",
        "Dashboard cleaning",
        "Cabin sanitization",
        "Odour treatment",
      ],
    },
    {
      id: "care-protection",
      title: "Protection & Detailing",
      shortTitle: "Protection",
      category: "Care",
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85",
      description:
        "Protect your vehicle against everyday wear, weather and environmental exposure.",
      points: [
        "Anti-rust protection",
        "Exterior detailing",
        "Glass treatment",
        "Underbody protection",
        "Paint protection",
      ],
    },
  ],

  /* Keep your existing data below this point */

  periodicMaintenance: [
    {
      id: "pm-1000",
      interval: "1st Free Service",
      mileage: "1,000 km / 1 Month",
      price: "Free of Labor Cost",
      duration: "45 mins",
      tag: "Initial Health Check",
      description:
        "Comprehensive initial inspection of engine fluids, electricals, and tire pressure after delivery.",
      checks: [
        "Engine oil level and coolant top-up inspection",
        "Brake pad bite and fluid level check",
        "Tire pressure & wheel nut torque check",
        "Battery voltage & electrical health scan",
        "Full body wash & interior vacuuming",
      ],
    },

    {
      id: "pm-5000",
      interval: "2nd Free Service",
      mileage: "5,000 km / 6 Months",
      price: "Free of Labor Cost",
      duration: "60 mins",
      tag: "Midway Checkup",
      description:
        "Fluid status audit, AC filter blow clean, underbody tightening, and mechanical diagnostics.",
      checks: [
        "Air filter clean & AC dust filter check",
        "Underbody nut-bolt torque check",
        "Suspension inspection & tire tread check",
        "Wiper washer spray & windscreen fluid top-up",
        "Comprehensive computerized vehicle health scan",
      ],
    },

    {
      id: "pm-10000",
      interval: "3rd Free Service / 10K Major",
      mileage: "10,000 km / 12 Months",
      price: "Free Labor (Parts as per actuals)",
      duration: "90 mins",
      tag: "First Annual Service",
      description:
        "Engine oil replacement, oil filter change, and wheel rotation.",
      checks: [
        "Ecstar Engine Oil change & new genuine oil filter",
        "Wheel alignment & tire rotation",
        "Brake calipers greasing & pad thickness measurement",
        "AC cooling efficiency check",
        "36-point safety and electrical diagnostic audit",
      ],
    },

    {
      id: "pm-20000",
      interval: "Periodic 20K / 2-Year Service",
      mileage: "20,000 km / 24 Months",
      price: "Starts at ₹ 3,499*",
      duration: "120 mins",
      tag: "Major Maintenance",
      description:
        "Complete maintenance covering fluids, filters, spark plugs and mechanical components.",
      checks: [
        "Engine oil & filter replacement",
        "Brake fluid flushing",
        "Air cleaner element replacement",
        "Spark plug inspection",
        "Suspension & steering linkage check",
      ],
    },
  ],

  specializedPackages: [
    {
      id: "sp-express",
      title: "60-Minute Express Maintenance",
      subtitle: "Twin-Technician Dedicated Bay",
      price: "Standard Service Rates",
      badge: "Zero Waiting Time",
      icon: "zap",
      description:
        "Two certified technicians work simultaneously on your vehicle in a synchronized workflow.",
      highlights: [
        "Dedicated quick bay",
        "Live status monitor",
        "Guaranteed turnaround time",
      ],
    },

    {
      id: "sp-doorstep",
      title: "Kalyani Doorstep Service Van",
      subtitle: "Certified Care at Your Home or Office",
      price: "Convenience Surcharge ₹ 299 only",
      badge: "At Your Door",
      icon: "truck",
      description:
        "Fully equipped mobile service van staffed with master technicians.",
      highlights: [
        "Contactless service",
        "Eco-friendly oil disposal",
        "No showroom travel required",
      ],
    },

    {
      id: "sp-bodyshop",
      title: "Accidental Repair & Cashless Claims",
      subtitle: "State-of-the-Art Paint Booth & Denter",
      price: "Cashless Tie-ups with 25+ Insurers",
      badge: "Original Maruti Finish",
      icon: "shield",
      description: "Professional accident repair and insurance assistance.",
      highlights: [
        "Claim approval assistance",
        "OEM genuine panels",
        "Warranty on paint job",
      ],
    },

    {
      id: "sp-deep-sanitization",
      title: "Interior Spa & Anti-Rust Coating",
      subtitle: "Monsoon Underbody Protection & Ozone Cleaning",
      price: "Packages starting ₹ 1,299*",
      badge: "Popular Add-on",
      icon: "sparkles",
      description:
        "Interior cleaning and underbody protection for long-term vehicle care.",
      highlights: [
        "Underbody protection",
        "Interior deep cleaning",
        "Rain-repellent windshield coating",
      ],
    },
  ],

  insurancePartners: [
    "Maruti Insurance Broking",
    "Bajaj Allianz General Insurance",
    "ICICI Lombard",
    "HDFC ERGO",
    "New India Assurance",
    "Tata AIG",
    "National Insurance",
  ],
};
