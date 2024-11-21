import React from "react";
import { User, Package, TicketPercent, ShoppingCart, Folder } from "lucide-react";
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
      label: 'Products', 
      icon: Package 
    },
    { 
      type: TAB_TYPE.CUSTOMER, 
      label: 'Customers', 
      icon: User 
    },
    { 
      type: TAB_TYPE.ORDER, 
      label: 'Orders', 
      icon: ShoppingCart 
    },
    { 
      type: TAB_TYPE.COUPON, 
      label: 'Coupons', 
      icon: TicketPercent 
    },
    { 
      type: TAB_TYPE.CATEGORY, 
      label: 'Categories', 
      icon: Folder 
    }
  ];

  return (
    <div className="flex gap-4 mb-6">
      {tabConfigs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 
              ${
                activeTab === tab.type
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
          >
            <Icon className="w-5 h-5" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;