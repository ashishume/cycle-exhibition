import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export const BIKE_DATA = [
  // Brand 1
  {
    brand: "Mountain Bikes",
    subtitle: "For Adventure Seekers",
    variants: [
      "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/1208777/pexels-photo-1208777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    color: "from-green-600 to-emerald-800",
  },
  // Brand 2
  {
    brand: "Road Bikes",
    subtitle: "Speed Redefined",
    variants: [
      "https://images.pexels.com/photos/1174103/pexels-photo-1174103.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/161172/cycling-bike-trail-sport-161172.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/114675/pexels-photo-114675.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    color: "from-blue-600 to-indigo-800",
  },
  // Brand 3
  {
    brand: "Electric Bikes",
    subtitle: "Future of Mobility",
    variants: [
      "https://images.pexels.com/photos/369264/pexels-photo-369264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    color: "from-purple-600 to-violet-800",
  },
];
const GlassButton = ({ children, onClick }: any) => (
  <button
    onClick={onClick}
    className="group flex items-center gap-2 px-6 py-3 rounded-xl
    bg-white/10 backdrop-blur-md border border-white/20
    hover:bg-white/20 hover:border-white/30 hover:scale-105
    transition-all duration-300 ease-out
    shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
  >
    {children}
  </button>
);

const BikePresentation = () => {
  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (isTransitioning) return;

      switch (event.key) {
        case "ArrowRight":
          setIsTransitioning(true);
          setCurrentVariantIndex(
            (prev) => (prev + 1) % BIKE_DATA[currentBrandIndex].variants.length
          );
          break;
        case "ArrowLeft":
          setIsTransitioning(true);
          setCurrentVariantIndex((prev) =>
            prev === 0
              ? BIKE_DATA[currentBrandIndex].variants.length - 1
              : prev - 1
          );
          break;
        case "ArrowUp":
          setIsTransitioning(true);
          setCurrentBrandIndex((prev) =>
            prev === 0 ? BIKE_DATA.length - 1 : prev - 1
          );
          setCurrentVariantIndex(0);
          break;
        case "ArrowDown":
          setIsTransitioning(true);
          setCurrentBrandIndex((prev) => (prev + 1) % BIKE_DATA.length);
          setCurrentVariantIndex(0);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentBrandIndex, isTransitioning]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden bg-gradient-to-br ${BIKE_DATA[currentBrandIndex].color}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
        {/* Header */}
        <div className="absolute top-8 left-0 right-0 text-center z-10">
          <h1 className="text-white text-6xl font-bold tracking-tight mb-2">
            {BIKE_DATA[currentBrandIndex].brand}
          </h1>
          <p className="text-white/80 text-xl font-light">
            {BIKE_DATA[currentBrandIndex].subtitle}
          </p>
        </div>

        {/* Image Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={BIKE_DATA[currentBrandIndex].variants[currentVariantIndex]}
            alt={`${BIKE_DATA[currentBrandIndex].brand} variant ${
              currentVariantIndex + 1
            }`}
            className={`max-w-full max-h-full object-contain transition-all duration-500 ease-out ${
              isTransitioning ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
            onTransitionEnd={handleTransitionEnd}
          />
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-0 right-0 px-8">
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            {BIKE_DATA[currentBrandIndex].variants.map((_, index) => (
              <div
                key={index}
                className={`w-16 h-1 mx-1 rounded-full transition-all duration-300 ${
                  index === currentVariantIndex ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-8 text-white/90">
            <GlassButton className="flex items-center gap-2 hover:text-white transition-colors duration-300">
              <ChevronLeft size={24} className="animate-pulse" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Previous
              </span>
            </GlassButton>
            <GlassButton className="flex items-center gap-2 hover:text-white transition-colors duration-300">
              <ChevronRight size={24} className="animate-pulse" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Next
              </span>
            </GlassButton>
            <GlassButton className="flex items-center gap-2 hover:text-white transition-colors duration-300">
              <ChevronUp size={24} className="animate-pulse" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Previous Brand
              </span>
            </GlassButton>
            <GlassButton className="flex items-center gap-2 hover:text-white transition-colors duration-300">
              <ChevronDown size={24} className="animate-pulse" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Next Brand
              </span>
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikePresentation;
