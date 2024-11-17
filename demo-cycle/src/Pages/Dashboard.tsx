import React, { useEffect, useState } from "react";
import {
  Bike,
  Package,
  DollarSign,
  Info,
  X,
  Presentation,
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios";
import { IProduct } from "../models/Product";
interface ICycleCardProps {
  cycle: IProduct;
  onAddToCart: (cycleId: string, quantity: number) => void;
}

interface ICartItem {
  cycleId: string;
  quantity: number;
}

const CycleCard: React.FC<ICycleCardProps> = ({ cycle, onAddToCart }) => {
  const [showDetails, setShowDetails] = useState(false);
  // const [showPresentation, setShowPresentation] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(cycle.bundleSize);
  const [showAddedAlert, setShowAddedAlert] = useState(false);

  const navigate = useNavigate();
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === cycle.imageLinks.length - 1 ? 0 : prev + 1
    );
  };

  // const handleQuantityChange = (increment: boolean) => {
  //   setQuantity((prev) => {
  //     const newValue = increment
  //       ? prev + cycle.bundleSize
  //       : prev - cycle.bundleSize;
  //     return Math.max(cycle.bundleSize, Math.min(newValue, cycle.stock));
  //   });
  // };

  // const handleAddToCart = () => {
  //   onAddToCart(cycle._id, quantity);
  //   setShowAddedAlert(true);
  //   setTimeout(() => setShowAddedAlert(false), 2000);
  // };

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
            {/* <div className="flex items-center gap-2 text-white">
              <DollarSign className="w-4 h-4" />
              <span>₹{cycle.costPerCycle}/cycle</span>
            </div> */}
          </div>

          {/* Quantity Controls */}
          {/* <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl">
            <button
              onClick={() => handleQuantityChange(false)}
              disabled={quantity <= cycle.bundleSize}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <Minus className="w-4 h-4 text-white" />
            </button>
            <span className="text-white font-medium">{quantity} cycles</span>
            <button
              onClick={() => handleQuantityChange(true)}
              disabled={quantity >= cycle.stock}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div> */}

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

          {/* Add to Cart Button */}
          {/* <button
            onClick={handleAddToCart}
            className="w-full py-2 px-4 bg-gradient-to-r from-amber-500/80 to-orange-500/80
                     hover:from-amber-500 hover:to-orange-500
                     rounded-xl text-white font-medium
                     transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart • ₹{(quantity * cycle.costPerCycle).toFixed(2)}
          </button> */}
        </div>

        {/* Added to Cart Alert */}
        {showAddedAlert && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top duration-300">
            {/* <Alert className="bg-emerald-500/90 text-white border-none"> */}
            {/* <Sparkles className="h-4 w-4" /> */}
            {/* <AlertDescription> */}
            {/* Added {quantity} cycles to cart! */}
            {/* </AlertDescription> */}
            {/* </Alert> */}
          </div>
        )}
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
                  {/* <div className="flex items-center gap-2 text-white">
                    <DollarSign className="w-5 h-5" />
                    <span>Cost per Cycle: ₹{cycle.costPerCycle}</span>
                  </div> */}
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

      {/* Presentation Modal */}
      {/* {showPresentation && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
          <div className="w-full h-full p-8 animate-in zoom-in duration-500">
            <button
              onClick={() => setShowPresentation(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="h-full flex flex-col items-center justify-center gap-8">
              <img
                src={cycle.imageLinks[currentImageIndex]}
                alt={cycle.brand}
                className="max-h-[60vh] object-contain rounded-2xl shadow-2xl"
              />

              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-white">{cycle.brand}</h2>
                {cycle.subtitle && (
                  <p className="text-xl text-white/70">{cycle.subtitle}</p>
                )}
                <div className="flex items-center justify-center gap-6 text-white">
                  <div className="flex items-center gap-2">
                    <Package className="w-6 h-6" />
                    <span className="text-lg">
                      Bundle of {cycle.bundleSize}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6" />
                    <span className="text-lg">₹{cycle.costPerCycle}/cycle</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

const CyclesList: React.FC = () => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
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

  const handleAddToCart = (cycleId: string, quantity: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.cycleId === cycleId);
      if (existingItem) {
        return prev.map((item) =>
          item.cycleId === cycleId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { cycleId, quantity }];
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bike className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Available Cycles</h1>
          </div>
          <div className="relative">
            <ShoppingCart className="w-6 h-6 text-white" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((cycle) => (
            <CycleCard
              key={cycle._id}
              cycle={cycle}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CyclesList;
