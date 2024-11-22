import React from "react";
import {
  User,
  Package,
  TicketPercent,
  ShoppingCart,
  Folder,
  Bike,
} from "lucide-react";
import { TAB_TYPE } from "../../constants/admin";

export interface TabConfig {
  type: string;
  label: string;
  icon: React.ElementType;
}

export interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const tabConfigs: TabConfig[] = [
    {
      type: TAB_TYPE.PRODUCT,
      label: "Products",
      icon: Package,
    },
    {
      type: TAB_TYPE.CUSTOMER,
      label: "Customers",
      icon: User,
    },
    {
      type: TAB_TYPE.ORDER,
      label: "Orders",
      icon: ShoppingCart,
    },
    {
      type: TAB_TYPE.COUPON,
      label: "Coupons",
      icon: TicketPercent,
    },
    {
      type: TAB_TYPE.CATEGORY,
      label: "Categories",
      icon: Folder,
    },
    {
      type: TAB_TYPE.ADD_PRODUCT,
      label: "Add Product",
      icon: Bike,
    },
  ];

  return (
    <div className="relative w-full">
      {/* Gradient indicators for scroll */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none md:hidden" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none md:hidden" />

      {/* Scrollable container */}
      <div className="overflow-x-auto scrollbar-hide mb-6">
        <div className="flex gap-2 md:gap-4 min-w-min pb-2 md:pb-0">
          {tabConfigs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.type}
                onClick={() => setActiveTab(tab.type)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl whitespace-nowrap transition-all duration-300 text-sm md:text-base
                  ${
                    activeTab === tab.type
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
