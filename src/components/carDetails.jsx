import React, { useState } from 'react';
import fronxVideo from './components/videos/Fronx_fold_desktop.mp4';

const CarDetailsPage = ({ 
  brand = "MARUTI SUZUKI",
  carName = "Fronx", 
  tagline = "BOLD MOVES AHEAD",
  videoSrc = fronxVideo,
  description = "A coupe-inspired SUV that blends style, technology and performance for every journey.",
  price = "9,70,900",
  variants = ["SIGMA", "DELTA", "DELTA+", "ZETA", "ALPHA"],
  types = ["1.2L MT", "1.2L AGS", "1.0L Turbo MT", "1.0L Turbo AT", "CNG"],
  colors = ["#1a3c75", "#ffffff", "#d3d3d3", "#808080", "#8b0000", "#000000"]
}) => {
  const [selectedVariant, setSelectedVariant] = useState("ZETA");
  const [selectedType, setSelectedType] = useState("1.0L Turbo MT");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6">
      {/* Back Button */}
      <button className="flex items-center text-sm font-medium mb-6 hover:text-gray-600">
        <span className="mr-2">←</span> Back
      </button>

      {/* 1. HERO / DISPLAY COMPONENT */}
      <section className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-8 bg-white p-8 rounded-2xl shadow-sm">
        
        {/* Left: Branding & Info */}
        <div className="flex-1">
          <p className="text-sm tracking-widest text-gray-500 uppercase">{brand}</p>
          <h1 className="text-6xl font-black mt-2 mb-2">{carName}</h1>
          <p className="text-sm tracking-[0.2em] text-gray-400 mb-6">{tagline}</p>
          <p className="text-gray-600 max-w-sm mb-8">{description}</p>
          
          {/* Highlights */}
          <div className="flex gap-6">
            <div className="flex flex-col items-center"><div className="w-10 h-10 bg-gray-100 rounded-full mb-2"></div><span className="text-xs font-bold">Petrol</span><span className="text-[10px] text-gray-400">Fuel Type</span></div>
            <div className="flex flex-col items-center"><div className="w-10 h-10 bg-gray-100 rounded-full mb-2"></div><span className="text-xs font-bold">5</span><span className="text-[10px] text-gray-400">Seating Capacity</span></div>
            <div className="flex flex-col items-center"><div className="w-10 h-10 bg-gray-100 rounded-full mb-2"></div><span className="text-xs font-bold">5MT / 5AMT</span><span className="text-[10px] text-gray-400">Transmission</span></div>
          </div>
        </div>

        {/* Center: Car Placeholder (Replacing 360 view) */}
        <div className="flex-[2] flex flex-col items-center justify-center relative min-h-[300px] bg-blue-50/50 rounded-full">
          <div className="absolute top-4 text-xs bg-white px-3 py-1 rounded-full shadow-sm">Static View Placeholder (360 omitted)</div>
          <div className="w-full h-auto bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 shadow-lg">
            [ Dynamic Car Image / {carName} ]
          </div>
        </div>

        {/* Right: Selectors & Price */}
        <div className="flex-1 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div className="mb-4">
            <label className="text-xs text-gray-500">Model</label>
            <select className="w-full p-2 border rounded-md mt-1 font-semibold bg-white">{/* Dynamic */}
              <option>{carName}</option>
            </select>
          </div>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Variant</label>
              <select value={selectedVariant} onChange={(e)=>setSelectedVariant(e.target.value)} className="w-full p-2 border rounded-md mt-1 bg-white">
                {variants.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Type</label>
              <select value={selectedType} onChange={(e)=>setSelectedType(e.target.value)} className="w-full p-2 border rounded-md mt-1 bg-white">
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-xs text-gray-500">Ex-showroom price</p>
            <h2 className="text-3xl font-bold">₹ {price} /-</h2>
          </div>
          <div>
            <div className="flex gap-2">
              {colors.map((c, i) => (
                <button key={i} className={`w-6 h-6 rounded-full border-2 ${i === 0 ? 'border-blue-500' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: c }}></button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Nexa Blue (Celestial)</p>
          </div>
        </div>
      </section>

      {/* 2. SPECIFICATIONS COMPONENT */}
      <section className="mb-16 bg-white p-8 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold">Specifications</h2>
          <div className="flex bg-gray-100 rounded-full p-1">
            <button className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm">Performance</button>
            <button className="px-6 py-2 text-gray-600 rounded-full text-sm">Safety</button>
            <button className="px-6 py-2 text-gray-600 rounded-full text-sm">Technology</button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          {/* Left Stats */}
          <div className="space-y-8 flex-1">
            <StatItem title="Engine" value="1.0L Turbo" desc="Boosted for thrilling performance" />
            <StatItem title="Power" value="89.73 PS @ 6000 rpm" desc="Power that moves you" />
            <StatItem title="Torque" value="113 Nm @ 4400 rpm" desc="Stronger for every drive" />
            <StatItem title="Transmission" value="5MT / 5AMT" desc="Smooth and efficient" />
          </div>

          {/* Top View Car Placeholder */}
          <div className="flex-1 flex justify-center">
             <div className="w-[200px] h-[450px] bg-gray-300 rounded-full flex items-center justify-center shadow-inner">
              <video className="flex w-full h-auto" src={videoSrc} autoPlay loop muted playsInline>Video not supported</video>
             </div>
          </div>

          {/* Right Stats */}
          <div className="space-y-8 flex-1 pl-12">
            <StatItem title="Fuel Type" value="Petrol" desc="Efficient and reliable" />
            <StatItem title="Mileage" value="20.01 km/l (ARAI)" desc="Go further with confidence" />
            <StatItem title="Fuel Tank Capacity" value="37 Litres" desc="Ready for longer journeys" />
            <StatItem title="Boot Space" value="308 Litres" desc="More space for what matters" />
          </div>
        </div>
      </section>

      {/* 3. GALLERY COMPONENT */}
      <section className="mb-16 bg-white p-8 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Gallery</h2>
          <div className="flex bg-gray-100 rounded-full p-1">
            <button className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm">Exterior</button>
            <button className="px-6 py-2 text-gray-600 rounded-full text-sm">Interior</button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 h-[400px]">
          {/* Main Large Image */}
          <div className="col-span-2 bg-gray-200 rounded-xl relative flex items-center justify-between p-4">
            <button className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center">←</button>
            <span className="text-gray-400">[ Main Exterior Placeholder ]</span>
            <button className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center">→</button>
          </div>
          {/* Thumbnails Grid */}
          <div className="grid grid-rows-2 grid-cols-2 gap-4">
            <div className="bg-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400">[ Thumb 1 ]</div>
            <div className="bg-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400">[ Thumb 2 ]</div>
            <div className="bg-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400">[ Thumb 3 ]</div>
            <div className="bg-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400">[ Thumb 4 ]</div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER: FAQ & EXPLORE MORE */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <a href="#" className="text-sm text-blue-600 font-medium">View All →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
          <FaqCard question={`What is the mileage of Maruti Suzuki ${carName}?`} />
          <FaqCard question={`What are the available variants of ${carName}?`} />
          <FaqCard question={`Does the ${carName} have a sunroof?`} />
          <FaqCard question={`What is the boot space of ${carName}?`} />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Explore More</h2>
          <a href="#" className="text-sm text-blue-600 font-medium">View All Cars →</a>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4">
          <ExploreCard name="Baleno" tag="Premium Hatchback" />
          <ExploreCard name="Grand Vitara" tag="The Advanced SUV" />
          <ExploreCard name="Jimny" tag="The Off-Road Icon" />
          <ExploreCard name="Invicto" tag="Premium MPV" />
          <ExploreCard name="Ertiga" tag="Spacious by Nature" />
        </div>
      </section>

    </div>
  );
};

// --- SUB COMPONENTS ---

const StatItem = ({ title, value, desc }) => {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0"></div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="font-bold text-lg">{value}</p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
    </div>
  );
};

const FaqCard = ({ question }) => {
  return (
    <div className="border border-gray-200 rounded-xl p-6 flex justify-between items-start bg-white shadow-sm hover:shadow-md transition">
      <p className="text-sm font-medium pr-4">{question}</p>
      <button className="w-6 h-6 rounded-full border flex items-center justify-center text-gray-400 shrink-0">+</button>
    </div>
  );
};

const ExploreCard = ({ name, tag }) => {
  return (
    <div className="min-w-[250px] border border-gray-100 bg-white rounded-xl p-4 flex flex-col justify-end shadow-sm hover:shadow-md transition">
      <div className="h-[120px] bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-xs text-gray-400">
        [ {name} Image ]
      </div>
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-xs text-gray-500">{tag}</p>
        </div>
        <span className="text-gray-400">→</span>
      </div>
    </div>
  );
};

export default CarDetailsPage;