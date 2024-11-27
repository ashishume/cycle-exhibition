import React, { useEffect, useState } from "react";
import { Bike, Info, X, Search, Loader2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios";
import { IProduct } from "../models/Product";
import { createPortal } from "react-dom";
import { ICategory } from "../models/Category";
import { BACKGROUND_COLOR, GRAY_BACKGROUND, MODAL_BACKGROUND } from "../constants/styles";
import LucideLoaderComp from "./Components/Loader";

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
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${MODAL_BACKGROUND} backdrop-blur-md 
                 rounded-2xl border border-white/20 p-6 max-w-2xl w-full space-y-6
                 animate-in slide-in-from-bottom duration-300`}
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
              <div className="text-white">
                <h4 className="font-medium mb-2">Available Sizes:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {cycle.variants.map((variant) =>
                    variant.costPerProduct > 0 ? (
                      <div
                        key={variant._id}
                        className="bg-white/10 rounded-lg p-2 text-center"
                      >
                        <div className="font-medium">{variant.size}"</div>
                        {
                          <>
                            <div className="text-sm text-white/70">
                              ₹{variant.costPerProduct}
                            </div>
                            <div className="text-sm text-white/70">
                              bundle: {variant.bundleSize}
                            </div>
                          </>
                        }
                      </div>
                    ) : null
                  )}
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
        className={`bg-white/40 ${GRAY_BACKGROUND} backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden
                   transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
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

  // const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[] | null>(
    null
  );
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category._id === selectedCategory
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };
  const fetchProducts = async () => {
    try {
      const response = await apiClient.get<IProduct[]>("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className={`min-h-screen ${BACKGROUND_COLOR} p-8`}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Bike className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-bold text-white">Available Cycles</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
            <input
              type="text"
              placeholder="Search cycles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl 
                         text-white placeholder-white/70 focus:outline-none focus:ring-2 
                         focus:ring-purple-500 w-full md:w-64"
            />
          </div>
          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-xl 
                         text-white appearance-none focus:outline-none focus:ring-2 
                         focus:ring-purple-500 w-full md:w-48"
            >
              <option className="bg-white/5" value="">All Categories</option>
              {categories?.map((category) => (
                <option className="bg-white/5" key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-white/70">
          Showing {filteredProducts?.length} of {products.length} cycles
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts?.map((cycle) => (
            <CycleCard key={cycle._id} cycle={cycle} />
          ))}

          {filteredProducts?.length === 0 && (
            <div className="col-span-full text-center text-white/70 py-12">
              No cycles found matching your criteria.
            </div>
          )}
        </div>
      </div>
      {filteredProducts === null && (
        <LucideLoaderComp
          icon={Loader2}
          size={64}
          color="white"
          message={"Loading..."}
          speed={1.5}
        />
      )}
    </div>
  );
};

export default CyclesList;
