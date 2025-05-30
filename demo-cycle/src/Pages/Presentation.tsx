import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";

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
import { CART_STORAGE_KEY, TYRE } from "../constants/Cart";

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
  // const [tyreStatus, setTyreStatus] = useState("");

  const totalProducts = currentPriceVariant
    ? bundleQuantity * currentPriceVariant.bundleSize
    : 0;

  const [cartItems, setCartItems] = useState<any[]>(loadCartFromStorage());

  const [tyreType, setTyreType] = useState(""); // tube-tyre or tubeless
  const [brandType, setBrandType] = useState(""); // branded or non-branded

  const tyreTypeOptions = [
    { label: "Tube tyre (+ ₹300)", value: TYRE.TUBE_TYRE },
    { label: "Tubeless tyre (no cost)", value: TYRE.TUBELESS },
  ];

  const brandOptions = [
    { label: "Branded (+ ₹100)", value: TYRE.BRANDED },
    { label: "Non branded (no cost)", value: TYRE.NON_BRANDED },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (currentBike?.variants) {
      const validVariant = currentBike.variants.find(
        (v) => v.costPerProduct > 0
      );
      setCurrentVariant(validVariant || null);
    }
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

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentModelIndex(
        (prev) => (prev + 1) % currentBike?.imageLinks?.length
      );
    },
    onSwipedRight: () => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentModelIndex((prev) =>
        prev === 0 ? currentBike?.imageLinks?.length - 1 : prev - 1
      );
    },
    onSwipedUp: () => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentBrandIndex((prev) =>
        prev === 0 ? products?.length - 1 : prev - 1
      );
      setCurrentModelIndex(0);
    },
    onSwipedDown: () => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentBrandIndex((prev) => (prev + 1) % products?.length);
      setCurrentModelIndex(0);
    },
  });

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

  const calculateTotalCost = () => {
    const baseCostPerProduct = currentPriceVariant?.costPerProduct || 0;
    let additionalCostPerProduct = 0;

    if (tyreType === TYRE.TUBE_TYRE) {
      additionalCostPerProduct += 300; // Base tube tyre cost per cycle
      if (brandType === TYRE.BRANDED) {
        additionalCostPerProduct += 100; // Additional branded cost per cycle
      }
    }

    const totalCostPerProduct = baseCostPerProduct + additionalCostPerProduct;
    const totalProducts =
      bundleQuantity * (currentPriceVariant?.bundleSize || 0);
    const totalCost = totalProducts * totalCostPerProduct;

    return {
      totalCost,
      additionalCostPerProduct,
      totalCostPerProduct,
      baseCostPerProduct,
    };
  };

  const { totalCost, additionalCostPerProduct } = calculateTotalCost();

  const handleAddToCart = () => {
    const newItem = {
      _id: currentBike?._id,
      brand: currentBike?.brand,
      variant: currentPriceVariant?.size,
      bundleQuantity,
      totalProducts,
      tyreType,
      brandType,
      costPerProduct: currentPriceVariant?.costPerProduct,
      bundleSize: currentPriceVariant?.bundleSize,
      total: totalCost,
      additionalCost: additionalCostPerProduct,
    };
    setCartItems([...cartItems, newItem]);
    setBundleQuantity(1);
    setTyreType("");
    setBrandType("");
  };

  const handleSizeChange = (variant: IVariant) => {
    setCurrentVariant(variant);
  };

  // const handleDropdownChange = (value: any) => {
  //   setTyreStatus(value);
  // };

  return (
    <div
      {...swipeHandlers}
      className={`relative w-screen h-screen overflow-hidden`}
    >
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
          <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight mb-1 md:mb-2">
            {currentBike?.brand}
          </h1>
          <div className="flex flex-col items-center gap-1 md:gap-2">
            <div className="text-white drop-shadow-2xl bg-black/30 px-2 rounded text-sm md:text-lg">
              <Package className="inline-block mr-2 mb-1" size={16} />
              {currentPriceVariant
                ? `Bundle of ${
                    currentPriceVariant.bundleSize
                  } products (₹${currentPriceVariant.costPerProduct.toFixed(
                    2
                  )} per piece)`
                : "Select a variant"}
            </div>
          </div>
        </div>
        {/* Navigation Controls - Always Visible */}
        {/* use the below class to unhide the arrow keys */}
        {/* <div className="fixed left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 pointer-events-none z-20"> */}
        <div className="fixed left-0 right-0 top-1/2 -translate-y-1/2 hidden md:flex justify-between px-4 md:px-8 pointer-events-none z-20">
          {/* Previous/Next Image Controls */}
          <div className="flex flex-col gap-4">
            <GlassButton
              onClick={navigateToPreviousBrand}
              className="pointer-events-auto !p-2 md:!p-4"
            >
              <ChevronUp size={20} className="md:hidden" />
              <span className="hidden md:inline text-sm font-medium uppercase tracking-wider text-white">
                Previous Brand
              </span>
            </GlassButton>
            <GlassButton
              onClick={() =>
                setCurrentModelIndex((prev) =>
                  prev === 0 ? currentBike?.imageLinks?.length - 1 : prev - 1
                )
              }
              className="pointer-events-auto !p-2 md:!p-4"
            >
              <ChevronLeft color="white" size={20} />
            </GlassButton>
          </div>

          {/* Next Controls */}
          <div className="flex flex-col gap-4">
            <GlassButton
              onClick={navigateToNextBrand}
              className="pointer-events-auto !p-2 md:!p-4"
            >
              <ChevronDown size={20} className="md:hidden" />
              <span className="hidden md:inline text-sm font-medium uppercase tracking-wider text-white">
                Next Brand
              </span>
            </GlassButton>
            <GlassButton
              onClick={() =>
                setCurrentModelIndex(
                  (prev) => (prev + 1) % currentBike?.imageLinks?.length
                )
              }
              className="pointer-events-auto !p-2 md:!p-4"
            >
              <ChevronRight size={20} color="white" />
            </GlassButton>
          </div>
        </div>
        {/* Image Container */}
        <div
          {...swipeHandlers}
          className="relative w-full flex-1 flex items-center justify-center"
        >
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

          {/* Sizes Section */}
          <div className="flex flex-col justify-center items-center gap-1 text-white">
            <p>Sizes (inches)</p>
            <div className="flex gap-3 justify-center">
              {currentBike?.variants.map(
                ({ _id, size, costPerProduct, bundleSize }: IVariant) => {
                  return Number(costPerProduct) !== 0 ? (
                    <GlassButton
                      key={_id}
                      isActive={currentPriceVariant?._id === _id}
                      className="col-span-2 text-sm md:text-base"
                      onClick={() =>
                        handleSizeChange({
                          _id,
                          size,
                          costPerProduct,
                          bundleSize,
                        })
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
                          bg-white/10 backdrop-blur-md border border-white/20 justify-center"
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
              options={tyreTypeOptions}
              placeholder="Select tyre type"
              value={tyreType}
              onChange={(value) => {
                setTyreType(value);
                if (value === TYRE.TUBELESS) {
                  setBrandType("");
                }
              }}
            />

            {tyreType === TYRE.TUBE_TYRE && (
              <GlassDropdown
                options={brandOptions}
                placeholder="Select brand type"
                value={brandType}
                onChange={(value) => setBrandType(value)}
              />
            )}

            <GlassButton
              disabled={!tyreType || (tyreType === "tube-tyre" && !brandType)}
              onClick={handleAddToCart}
              className="col-span-2 text-sm md:text-base"
            >
              <ShoppingCart size={20} />
              <span className="text-sm font-medium uppercase tracking-wider">
                Add to Cart {totalCost > 0 && `(₹${totalCost.toFixed(2)})`}
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
    </div>
  );
};

export default BikePresentation;
