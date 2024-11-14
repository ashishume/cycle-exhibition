import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ShoppingCart,
  Plus,
  Minus,
  Info,
  Package
} from "lucide-react";

export const BIKE_DATA = [
  {
    brand: "Mountain Bikes",
    subtitle: "For Adventure Seekers",
    description: "Rugged and durable bikes perfect for off-road trails and mountain adventures. Features premium suspension and all-terrain tires.",
    costPerCycle: 1299.99,
    bundleSize: 5,
    imageLinks: [
      "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/1208777/pexels-photo-1208777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    color: "from-purple-600 to-violet-800",
  },
  {
    brand: "Road Bikes",
    subtitle: "Speed Redefined",
    description: "Lightweight and aerodynamic bikes designed for speed and efficiency on paved roads. Perfect for racing and long-distance rides.",
    costPerCycle: 1499.99,
    bundleSize: 6,
    imageLinks: [
      "https://images.pexels.com/photos/1174103/pexels-photo-1174103.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/161172/cycling-bike-trail-sport-161172.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/114675/pexels-photo-114675.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    color: "from-purple-600 to-violet-800",
  },
  {
    brand: "Electric Bikes",
    subtitle: "Future of Mobility",
    description: "Electric-assisted bikes combining convenience with eco-friendly transportation. Features long-lasting battery and smart controls.",
    costPerCycle: 2499.99,
    bundleSize: 7,
    imageLinks: [
      "https://images.pexels.com/photos/369264/pexels-photo-369264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    color: "from-purple-600 to-violet-800",
  },
];

const GlassButton = ({ children, onClick, disabled = false }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`group flex items-center gap-2 px-6 py-3 rounded-xl
    bg-white/10 backdrop-blur-md border border-white/20
    ${!disabled && "hover:bg-white/20 hover:border-white/30 hover:scale-105"}
    transition-all duration-300 ease-out
    shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
    ${disabled && "opacity-50 cursor-not-allowed"}`}
  >
    {children}
  </button>
);

const BikePresentation = () => {
  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bundleQuantity, setBundleQuantity] = useState(1);
  const [showDescription, setShowDescription] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const currentBike = BIKE_DATA[currentBrandIndex];

  // Calculate total cycles and cost
  const totalCycles = bundleQuantity * currentBike.bundleSize;
  const totalCost = bundleQuantity * currentBike.bundleSize * currentBike.costPerCycle;

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (isTransitioning) return;

      switch (event.key) {
        case "ArrowRight":
          setIsTransitioning(true);
          setCurrentVariantIndex(
            (prev) => (prev + 1) % currentBike.imageLinks.length
          );
          break;
        case "ArrowLeft":
          setIsTransitioning(true);
          setCurrentVariantIndex((prev) =>
            prev === 0
              ? currentBike.imageLinks.length - 1
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
  }, [currentBrandIndex, isTransitioning, currentBike.imageLinks.length]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  const handleAddToCart = () => {
    const newItem = {
      brand: currentBike.brand,
      variant: currentVariantIndex + 1,
      bundleQuantity,
      totalCycles,
      costPerCycle: currentBike.costPerCycle,
      bundleSize: currentBike.bundleSize,
      total: totalCost
    };
    setCartItems([...cartItems, newItem]);
    setBundleQuantity(1);
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden bg-gradient-to-br ${currentBike.color}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
      </div>

      {/* Cart Summary */}
      <div className="absolute top-8 right-8 z-20">
        <div className="flex items-center gap-4">
          <div className="text-white text-right">
            <div className="text-sm opacity-80">Cart Total</div>
            <div className="font-bold">
              ${cartItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
            </div>
          </div>
          <div className="relative">
            <ShoppingCart className="w-6 h-6 text-white" />
            {cartItems.length > 0 && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">
                  {cartItems.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
        {/* Header */}
        <div className="absolute top-8 left-0 right-0 text-center z-10">
          <h1 className="text-white text-6xl font-bold tracking-tight mb-2">
            {currentBike.brand}
          </h1>
          <p className="text-white/80 text-xl font-light mb-4">
            {currentBike.subtitle}
          </p>
          <div className="flex flex-col items-center gap-2">
            <div className="text-white/80 text-lg">
              <Package className="inline-block mr-2 mb-1" size={20} />
              Bundle of {currentBike.bundleSize} cycles
            </div>
            <div className="text-white text-2xl font-bold">
              ${currentBike.costPerCycle.toFixed(2)} per cycle
            </div>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={currentBike.imageLinks[currentVariantIndex]}
            alt={`${currentBike.brand} variant ${currentVariantIndex + 1}`}
            className={`max-w-full max-h-full object-contain transition-all duration-500 ease-out ${
              isTransitioning ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
            onTransitionEnd={handleTransitionEnd}
          />
        </div>

        {/* Bundle Calculator */}
        <div className="absolute bottom-48 left-0 right-0 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="text-white mb-2">
              {bundleQuantity} bundles = {totalCycles} cycles
            </div>
            <div className="text-white font-bold text-xl">
              Total: ${totalCost.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Description Modal */}
        {showDescription && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl max-w-2xl mx-4">
              <h3 className="text-white text-2xl font-bold mb-4">{currentBike.brand}</h3>
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                {currentBike.description}
              </p>
              <button
                onClick={() => setShowDescription(false)}
                className="text-white hover:text-white/80 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Navigation and Cart Controls */}
        <div className="absolute bottom-8 left-0 right-0 px-8">
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            {currentBike.imageLinks.map((_, index) => (
              <div
                key={index}
                className={`w-16 h-1 mx-1 rounded-full transition-all duration-300 ${
                  index === currentVariantIndex ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-4 text-white/90">
            {/* Navigation Buttons */}
            <GlassButton onClick={() => setCurrentVariantIndex((prev) => 
              prev === 0 ? currentBike.imageLinks.length - 1 : prev - 1
            )}>
              <ChevronLeft size={24} className="animate-pulse" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Previous
              </span>
            </GlassButton>
            
            <GlassButton onClick={() => setCurrentVariantIndex((prev) => 
              (prev + 1) % currentBike.imageLinks.length
            )}>
              <ChevronRight size={24} className="animate-pulse" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Next
              </span>
            </GlassButton>

            {/* Description Button */}
            <GlassButton onClick={() => setShowDescription(true)}>
              <Info size={24} />
              <span className="text-sm font-medium uppercase tracking-wider">
                Description
              </span>
            </GlassButton>

            {/* Bundle Quantity Controls */}
            <div className="flex items-center gap-2 px-6 py-3 rounded-xl
                          bg-white/10 backdrop-blur-md border border-white/20">
              <button
                onClick={() => setBundleQuantity(prev => Math.max(1, prev - 1))}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="w-12 text-center font-medium">
                {bundleQuantity} {bundleQuantity === 1 ? 'bundle' : 'bundles'}
              </span>
              <button
                onClick={() => setBundleQuantity(prev => prev + 1)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <GlassButton onClick={handleAddToCart}>
              <ShoppingCart size={24} />
              <span className="text-sm font-medium uppercase tracking-wider">
                Add to Cart
              </span>
            </GlassButton>

            {/* Brand Navigation */}
            <GlassButton onClick={() => {
              setIsTransitioning(true);
              setCurrentBrandIndex(prev => 
                prev === 0 ? BIKE_DATA.length - 1 : prev - 1
              );
              setCurrentVariantIndex(0);
            }}>
              <ChevronUp size={24} className="animate-pulse" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Previous Brand
              </span>
            </GlassButton>

            <GlassButton onClick={() => {
              setIsTransitioning(true);
              setCurrentBrandIndex(prev => (prev + 1) % BIKE_DATA.length);
              setCurrentVariantIndex(0);
            }}>
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