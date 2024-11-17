import React, { useEffect, useState } from "react";
import { Bike, Package, Info, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios";
import { IProduct } from "../models/Product";
import { createPortal } from "react-dom";

interface ICycleCardProps {
  cycle: IProduct;
}

const DetailsModal = ({
  cycle,
  onClose,
}: {
  cycle: IProduct;
  onClose: () => void;
}) => {
  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-md 
                 rounded-2xl border border-white/20 p-6 max-w-2xl w-full space-y-6
                 animate-in slide-in-from-bottom duration-300"
      >
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-white">{cycle.brand}</h2>
          <button
            onClick={onClose}
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
              <div className="text-white">
                <h4 className="font-medium mb-2">Available Sizes:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {cycle.variants.map((variant) => (
                    <div
                      key={variant._id}
                      className="bg-white/10 rounded-lg p-2 text-center"
                    >
                      <div className="font-medium">{variant.size}"</div>
                      {variant.costPerProduct > 0 && (
                        <div className="text-sm text-white/70">
                          ₹{variant.costPerProduct}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
    </div>,
    document.body
  );
};

const CycleCard: React.FC<ICycleCardProps> = ({ cycle }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

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
              <span>Bundle: {cycle.bundleSize}</span>
            </div>
            {/* <div className="text-white text-sm">Type: {cycle.tyreLabel}</div> */}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowDetails(true)}
              className="py-2 px-4 bg-gradient-to-r from-purple-500/80 to-indigo-500/80
                       hover:from-purple-500 hover:to-indigo-500
                       rounded-xl text-white font-medium
                       transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Info className="w-4 h-4" />
              Details
            </button>
            <button
              onClick={() => navigate(`/presentation/${cycle._id}`)}
              className="py-2 px-4 bg-gradient-to-r from-emerald-500/80 to-teal-500/80
                       hover:from-emerald-500 hover:to-teal-500
                       rounded-xl text-white font-medium
                       transition-all duration-300 flex items-center justify-center gap-2"
            >
              Showcase
            </button>
          </div>
        </div>

        {/* Render Modal */}
        {showDetails && (
          <DetailsModal cycle={cycle} onClose={() => setShowDetails(false)} />
        )}
      </div>
    </div>
  );
};

const CyclesList: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get<IProduct[]>("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Bike className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-bold text-white">Available Cycles</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((cycle) => (
            <CycleCard key={cycle._id} cycle={cycle} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CyclesList;
