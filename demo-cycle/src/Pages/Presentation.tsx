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
  Package,
} from "lucide-react";
import { IProduct, IVariant } from "../models/Product";
import apiClient from "../api/axios";
import GlassButton from "./Components/GlassButton";
import GlassDropdown from "./Components/GlassDropdown";
import { useNavigate, useParams } from "react-router-dom";
import { loadCartFromStorage } from "../utils/Localstorage";
import { CART_STORAGE_KEY } from "../constants/Cart";

const BikePresentation = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from URL

  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bundleQuantity, setBundleQuantity] = useState(1);
  const [showDescription, setShowDescription] = useState(false);

  const [showControls, setShowControls] = useState(true);
  const [products, setProducts] = useState([] as IProduct[]);
  const currentBike = products[currentBrandIndex];
  const [currentPriceVariant, setCurrentVariant] = useState<IVariant | null>(
    null
  );
  const [tyreStatus, setTyreStatus] = useState("");
  const totalProducts = bundleQuantity * (currentBike?.bundleSize || 0);
  const totalCost =
    bundleQuantity *
    (currentBike?.bundleSize || 0) *
    (currentPriceVariant?.costPerProduct || 0);

  const [cartItems, setCartItems] = useState<any[]>(loadCartFromStorage());

  const tyreOptions = [
    { label: "Branded", value: "branded" },
    { label: "Non branded", value: "non-branded" },
    { label: "Tubeless", value: "tubeless" },
    { label: "Tube tyre", value: "tube-tyre" },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentVariant(
      currentBike?.variants?.find((v) => v?.costPerProduct !== 0) || null
    );
  }, [currentBike]);

  // New effect to set initial brand index based on ID
  useEffect(() => {
    if (products.length > 0 && id) {
      const productIndex = products.findIndex((product) => product._id === id);
      if (productIndex !== -1) {
        setCurrentBrandIndex(productIndex);
        setCurrentModelIndex(0);
      } else {
        // If ID is invalid, redirect to the first product
        const firstProductId = products[0]?._id;
        if (firstProductId) {
          navigate(`/presentation/${firstProductId}`, { replace: true });
        }
      }
    }
  }, [products, id, navigate]);

  //add items to cart into localstorage
  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get<IProduct[]>("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const saveCartToStorage = (cart: any[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (isTransitioning) return;

      switch (event.key) {
        case "ArrowRight":
          setIsTransitioning(true);
          setCurrentModelIndex(
            (prev) => (prev + 1) % currentBike?.imageLinks?.length
          );
          break;
        case "ArrowLeft":
          setIsTransitioning(true);
          setCurrentModelIndex((prev) =>
            prev === 0 ? currentBike?.imageLinks?.length - 1 : prev - 1
          );
          break;
        case "ArrowUp":
          setIsTransitioning(true);
          setCurrentBrandIndex((prev) =>
            prev === 0 ? products?.length - 1 : prev - 1
          );
          setCurrentModelIndex(0);
          break;
        case "ArrowDown":
          setIsTransitioning(true);
          setCurrentBrandIndex((prev) => (prev + 1) % products?.length);
          setCurrentModelIndex(0);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentBrandIndex, isTransitioning, currentBike?.imageLinks?.length]);

  // Modified navigation functions to update URL
  const navigateToPreviousBrand = () => {
    setIsTransitioning(true);
    const newIndex =
      currentBrandIndex === 0 ? products.length - 1 : currentBrandIndex - 1;
    const newProductId = products[newIndex]._id;
    navigate(`/presentation/${newProductId}`);
    setCurrentBrandIndex(newIndex);
    setCurrentModelIndex(0);
  };

  const navigateToNextBrand = () => {
    setIsTransitioning(true);
    const newIndex = (currentBrandIndex + 1) % products.length;
    const newProductId = products[newIndex]._id;
    navigate(`/presentation/${newProductId}`);
    setCurrentBrandIndex(newIndex);
    setCurrentModelIndex(0);
  };

  const handleTransitionEnd = () => setIsTransitioning(false);

  const handleAddToCart = () => {
    const newItem = {
      _id: currentBike?._id,
      brand: currentBike?.brand,
      variant: currentPriceVariant?.size,
      bundleQuantity,
      totalProducts,
      isTyreChargeable: tyreStatus === "branded" || tyreStatus === "tube-tyre",
      tyreLabel: tyreStatus,
      costPerCycle: currentPriceVariant?.costPerProduct,
      bundleSize: currentBike?.bundleSize,
      total:
        totalCost +
        ((tyreStatus === "branded" || tyreStatus === "tube-tyre") === true
          ? 300
          : 0),
    };
    setCartItems([...cartItems, newItem]);
    setBundleQuantity(1);
    setTyreStatus("");
  };

  const handleSizeChange = (variant: any) => {
    setCurrentVariant(variant);
  };

  const handleDropdownChange = (value: any) => {
    setTyreStatus(value);
  };

  return (
    <div className={`relative w-screen h-screen overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
      </div>

      {/* Cart Summary */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
        <div
          className="flex items-center gap-2 md:gap-4 cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <div className="text-white text-right">
            <div className="text-xs md:text-sm opacity-80">Cart Total</div>
            <div className="text-sm md:text-base font-bold">
              ₹{" "}
              {cartItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
            </div>
          </div>
          <div className="relative">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-white" />
            {cartItems.length > 0 && (
              <div className="absolute -top-2 -right-2 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">
                  {cartItems.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
        {/* Header */}
        <div className="absolute top-4 md:top-8 left-0 right-0 text-center z-10">
          <h1 className="text-black text-3xl md:text-4xl font-bold tracking-tight mb-1 md:mb-2">
            {currentBike?.brand}
          </h1>
          <div className="flex flex-col items-center gap-1 md:gap-2">
            <div className="text-white drop-shadow-2xl  bg-black/30 px-2 rounded text-sm md:text-lg">
              <Package className="inline-block mr-2 mb-1" size={16} />
              Bundle of {currentBike?.bundleSize} products ( ₹
              {currentPriceVariant?.costPerProduct.toFixed(2)} per piece)
            </div>
            <div className="text-white text-lg md:text-2xl font-bold"></div>
          </div>
        </div>

        {/* Image Container - Updated with fixed dimensions */}
        <div className="relative w-full flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-3xl h-64 md:h-[34rem]">
            <img
              src={currentBike?.imageLinks[currentModelIndex]}
              alt={`${currentBike?.brand} variant ${currentModelIndex + 1}`}
              className={`w-full h-full object-cover transition-all duration-500 ease-out
                ${
                  isTransitioning
                    ? "scale-95 opacity-0"
                    : "scale-100 opacity-100"
                }`}
              onTransitionEnd={handleTransitionEnd}
            />
          </div>
        </div>

        {/* Mobile Toggle Controls Button */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="md:hidden fixed bottom-4 right-4 z-30 bg-white/20 backdrop-blur-md p-2 rounded-full"
        >
          {showControls ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
        </button>

        {/* Controls Container */}
        <div
          className={`fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md transition-transform duration-300 ease-in-out md:relative md:bg-transparent md:backdrop-blur-none
          ${
            showControls ? "translate-y-0" : "translate-y-full md:translate-y-0"
          }`}
        >
          {/* Bundle Calculator */}
          {/* <div className="text-center py-4">
            <div className="inline-block bg-white/10 backdrop-blur-md rounded-xl p-3 md:p-4">
              <div className="text-white text-sm md:text-base mb-1 md:mb-2">
                {bundleQuantity} bundles = {totalProducts} cycles
              </div>
              <div className="text-white font-bold text-lg md:text-xl">
                Total: ₹{totalCost.toFixed(2)}
              </div>
            </div>
          </div> */}

          {/* Progress Indicator */}
          <div className="flex justify-center mb-4">
            {currentBike?.imageLinks.map((_, index) => (
              <div
                key={index}
                className={`w-8 md:w-16 h-1 mx-1 rounded-full transition-all duration-300 
                  ${index === currentModelIndex ? "bg-white" : "bg-white/30"}`}
              />
            ))}
          </div>

          <div className="flex flex-col justify-center items-center gap-1 text-white">
            <p>Sizes (inches)</p>
            <div className="flex gap-3 justify-center">
              {currentBike?.variants.map(
                ({ _id, size, costPerProduct }: IVariant) => {
                  return Number(costPerProduct) !== 0 ? (
                    <GlassButton
                      key={_id}
                      isActive={currentPriceVariant?._id === _id}
                      className="col-span-2 text-sm md:text-base"
                      onClick={() =>
                        handleSizeChange({ _id, size, costPerProduct })
                      }
                    >
                      <span className="text-sm font-medium uppercase tracking-wider">
                        {size}
                      </span>
                    </GlassButton>
                  ) : null;
                }
              )}
            </div>
          </div>
          {/* Controls Grid */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-4 justify-center p-4 text-white/90">
            <GlassButton
              onClick={() =>
                setCurrentModelIndex((prev) =>
                  prev === 0 ? currentBike?.imageLinks?.length - 1 : prev - 1
                )
              }
              className="text-sm md:text-base"
            >
              <ChevronLeft size={20} className="animate-pulse" />
            </GlassButton>

            <GlassButton
              onClick={() =>
                setCurrentModelIndex(
                  (prev) => (prev + 1) % currentBike?.imageLinks?.length
                )
              }
              className="text-sm md:text-base"
            >
              <ChevronRight size={20} className="animate-pulse" />
            </GlassButton>

            <GlassButton
              onClick={() => setShowDescription(true)}
              className="text-sm md:text-base"
            >
              <Info size={20} />
              <span className="text-sm font-medium uppercase tracking-wider">
                Info
              </span>
            </GlassButton>

            <div
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-xl
                          bg-white/10 backdrop-blur-md border border-white/20"
            >
              <button
                onClick={() =>
                  setBundleQuantity((prev) => Math.max(1, prev - 1))
                }
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="w-8 md:w-12 text-center text-sm md:text-base font-medium">
                {bundleQuantity}
              </span>
              <button
                onClick={() => setBundleQuantity((prev) => prev + 1)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            <GlassDropdown
              options={tyreOptions}
              placeholder="Select tyre type"
              value={tyreStatus}
              onChange={(value) => handleDropdownChange(value)}
            />

            <GlassButton
              disabled={!tyreStatus?.length}
              onClick={handleAddToCart}
              className="col-span-2 text-sm md:text-base"
            >
              <ShoppingCart size={20} />
              <span className="text-sm font-medium uppercase tracking-wider">
                Add to Cart
              </span>
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Description Modal */}
      {showDescription && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30 p-4">
          <div className="bg-black p-6 md:p-8 rounded-2xl max-w-2xl mx-4">
            <h3 className="text-white text-xl md:text-2xl font-bold mb-3 md:mb-4">
              {currentBike?.brand}
            </h3>
            <p className="text-white/90 text-base md:text-lg leading-relaxed mb-4 md:mb-6">
              {currentBike?.description}
            </p>
            <button
              onClick={() => setShowDescription(false)}
              className="text-white hover:text-white/80 transition-colors text-sm md:text-base px-4 py-2 bg-white/10 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Brand Navigation */}
      <div className="hidden md:flex fixed left-4 right-4 top-1/2 -translate-y-1/2 justify-between pointer-events-none">
        <GlassButton
          onClick={navigateToPreviousBrand}
          className="pointer-events-auto"
        >
          <ChevronUp size={24} className="rotate-360" color="white" />
          <span className="text-sm font-medium uppercase tracking-wider text-white">
            Previous Brand
          </span>
        </GlassButton>

        <GlassButton
          onClick={navigateToNextBrand}
          className="pointer-events-auto"
        >
          <span className="text-sm font-medium uppercase tracking-wider text-white">
            Next Brand
          </span>
          <ChevronDown size={24} className="rotate-360" color="white" />
        </GlassButton>
      </div>

      {/* Mobile Brand Navigation */}
      <div className="fixed md:hidden left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <GlassButton onClick={navigateToPreviousBrand} className="!p-2">
          <ChevronUp size={20} />
        </GlassButton>

        <GlassButton onClick={navigateToNextBrand} className="!p-2">
          <ChevronDown size={20} />
        </GlassButton>
      </div>
    </div>
  );
};

export default BikePresentation;
