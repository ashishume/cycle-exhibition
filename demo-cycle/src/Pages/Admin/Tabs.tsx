// Tabs.tsx
import React from "react";
import { User, Package, ShoppingCart } from "lucide-react";
import { TAB_TYPE } from "../../constants/admin";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <>
      {/* Header */}
      <h1 className="text-3xl font-bold text-white mb-8">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab(TAB_TYPE.PRODUCT)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300
      ${
        activeTab === TAB_TYPE.PRODUCT
          ? "bg-white/20 text-white"
          : "bg-white/5 text-white/70 hover:bg-white/10"
      }`}
        >
          <Package className="w-5 h-5" />
          Products
        </button>
        <button
          onClick={() => setActiveTab(TAB_TYPE.CUSTOMER)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300
      ${
        activeTab === TAB_TYPE.CUSTOMER
          ? "bg-white/20 text-white"
          : "bg-white/5 text-white/70 hover:bg-white/10"
      }`}
        >
          <User className="w-5 h-5" />
          Customers
        </button>
      </div>
    </>
  );
};

export default Tabs;
