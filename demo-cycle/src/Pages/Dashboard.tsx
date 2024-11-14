import React, { useState } from "react";
import { Bike, Package, DollarSign, Info, X } from "lucide-react";

// Interfaces
interface ICycle {
  id: string;
  brand: string;
  imageLinks: string[];
  description?: string;
  subtitle?: string;
  costPerCycle: number;
  bundleSize: number;
}

interface ICycleCardProps {
  cycle: ICycle;
}

// Sample data
const sampleCycles: ICycle[] = [
  {
    id: "1",
    brand: "Mountain Explorer X1",
    description:
      "Premium mountain bike with advanced suspension system and all-terrain capabilities.",
    subtitle: "All-terrain performance",
    costPerCycle: 299.99,
    bundleSize: 5,
    imageLinks: [
      "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/1208777/pexels-photo-1208777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
  },
  {
    id: "2",
    brand: "City Cruiser Pro",
    imageLinks: [
      "https://images.pexels.com/photos/1174103/pexels-photo-1174103.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/161172/cycling-bike-trail-sport-161172.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/114675/pexels-photo-114675.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description:
      "Comfortable city bike perfect for daily commutes and leisure rides.",
    subtitle: "Urban comfort",
    costPerCycle: 199.99,
    bundleSize: 3,
  },
  {
    id: "3",
    brand: "Speed Racer Elite",
    imageLinks: [
      "https://images.pexels.com/photos/369264/pexels-photo-369264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    subtitle: "Racing performance",
    costPerCycle: 399.99,
    bundleSize: 4,
  },
];

const CycleCard: React.FC<ICycleCardProps> = ({ cycle }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === cycle.imageLinks.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative group">
      <div
        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden
                   transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      >
        {/* Image Carousel */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={cycle.imageLinks[currentImageIndex]}
            alt={cycle.brand}
            className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
            onClick={nextImage}
          />
          {cycle.imageLinks.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded-md text-white text-xs">
              {currentImageIndex + 1}/{cycle.imageLinks.length}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Bike className="w-5 h-5" />
              {cycle.brand}
            </h3>
            {cycle.subtitle && (
              <p className="text-white/70 text-sm">{cycle.subtitle}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Package className="w-4 h-4" />
              <span>Min Bundle: {cycle.bundleSize}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <DollarSign className="w-4 h-4" />
              <span>₹{cycle.costPerCycle}/cycle</span>
            </div>
          </div>

          {/* Details Button */}
          <button
            onClick={() => setShowDetails(true)}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-500/80 to-indigo-500/80
                     hover:from-purple-500 hover:to-indigo-500
                     rounded-xl text-white font-medium
                     transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Info className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-md 
                        rounded-2xl border border-white/20 p-6 max-w-2xl w-full space-y-6
                        animate-in slide-in-from-bottom duration-300"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-white">{cycle.brand}</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {cycle.subtitle && (
                  <p className="text-white/70">{cycle.subtitle}</p>
                )}
                {cycle.description && (
                  <p className="text-white/90">{cycle.description}</p>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <Package className="w-5 h-5" />
                    <span>Minimum Bundle Size: {cycle.bundleSize}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <DollarSign className="w-5 h-5" />
                    <span>Cost per Cycle: ₹{cycle.costPerCycle}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {cycle.imageLinks.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${cycle.brand} view ${index + 1}`}
                    className="rounded-lg object-cover w-full h-32 hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CyclesList: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Bike className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-bold text-white">Available Cycles</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleCycles.map((cycle) => (
            <CycleCard key={cycle.id} cycle={cycle} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CyclesList;
