import { useState } from "react";
import {
  User,
  Bike,
  Edit,
  Trash2,
  Search, ChevronLeft,
  ChevronRight
} from "lucide-react";

// Interfaces
interface ICustomer {
  id: string;
  customerName: string;
  selectedCycle: string;
  bundleSize: number;
  customerImage: string | null;
  leadType: string;
  totalCost: number;
}

interface ICycle {
  id: string;
  brand: string;
  imageLinks: string[];
  description?: string;
  subtitle?: string;
  costPerCycle: number;
  bundleSize: number;
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Sample data - In real app, this would come from your backend
  const [customers, setCustomers] = useState<ICustomer[]>([
    {
      id: "1",
      customerName: "John Doe",
      selectedCycle: "Cycle1",
      bundleSize: 2,
      customerImage: "/api/placeholder/100/100",
      leadType: "Hot Lead",
      totalCost: 1000,
    },
    {
      id: "2",
      customerName: "Jane Smith",
      selectedCycle: "Cycle2",
      bundleSize: 3,
      customerImage: "/api/placeholder/100/100",
      leadType: "Warm Lead",
      totalCost: 1500,
    },
  ]);

  const [cycles, setCycles] = useState<ICycle[]>([
    {
      id: "1",
      brand: "Cycle1",
      imageLinks: ["/api/placeholder/100/100"],
      description: "Premium cycle",
      subtitle: "Best seller",
      costPerCycle: 100,
      bundleSize: 5,
    },
    {
      id: "2",
      brand: "Cycle2",
      imageLinks: ["/api/placeholder/100/100"],
      description: "Economy cycle",
      subtitle: "Value choice",
      costPerCycle: 80,
      bundleSize: 6,
    },
  ]);

  // Filter and pagination logic
  const filterData = (data: any[], term: string) => {
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const getPaginatedData = (data: any[]) => {
    const filteredData = filterData(data, searchTerm);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: filteredData.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredData.length / itemsPerPage),
    };
  };

  // Delete handlers
  const handleDelete = (id: string, type: "customer" | "cycle") => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === "customer") {
        setCustomers((prev) => prev.filter((item) => item.id !== id));
      } else {
        setCycles((prev) => prev.filter((item) => item.id !== id));
      }
    }
  };

  // Edit handlers
  const handleEdit = (id: string) => {
    setEditingId(id);
    // In a real app, you would navigate to the edit form or open a modal
    console.log(`Editing ${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-8">
      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white mb-8">Admin Panel</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("customers")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300
              ${
                activeTab === "customers"
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
          >
            <User className="w-5 h-5" />
            Customers
          </button>
          <button
            onClick={() => setActiveTab("cycles")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300
              ${
                activeTab === "cycles"
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
          >
            <Bike className="w-5 h-5" />
            Cycles
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 
                     focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                     text-white placeholder-white/50 transition-all duration-300"
          />
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                {activeTab === "customers" ? (
                  <>
                    <th className="px-6 py-4 text-left text-white/90">Image</th>
                    <th className="px-6 py-4 text-left text-white/90">Name</th>
                    <th className="px-6 py-4 text-left text-white/90">Cycle</th>
                    <th className="px-6 py-4 text-left text-white/90">
                      Bundle Size
                    </th>
                    <th className="px-6 py-4 text-left text-white/90">
                      Lead Type
                    </th>
                    <th className="px-6 py-4 text-left text-white/90">
                      Total Cost
                    </th>
                    <th className="px-6 py-4 text-left text-white/90">
                      Actions
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-left text-white/90">Image</th>
                    <th className="px-6 py-4 text-left text-white/90">Brand</th>
                    <th className="px-6 py-4 text-left text-white/90">
                      Subtitle
                    </th>
                    <th className="px-6 py-4 text-left text-white/90">
                      Cost/Cycle
                    </th>
                    <th className="px-6 py-4 text-left text-white/90">
                      Bundle Size
                    </th>
                    <th className="px-6 py-4 text-left text-white/90">
                      Actions
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {activeTab === "customers"
                ? getPaginatedData(customers).data.map((customer) => (
                    <tr key={customer.id} className="hover:bg-white/5">
                      <td className="px-6 py-4">
                        <img
                          src={
                            customer.customerImage || "/api/placeholder/100/100"
                          }
                          alt={customer.customerName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 text-white">
                        {customer.customerName}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {customer.selectedCycle}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {customer.bundleSize}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {customer.leadType}
                      </td>
                      <td className="px-6 py-4 text-white">
                        ₹{customer.totalCost}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(customer.id)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 
                                     text-white transition-all duration-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(customer.id, "customer")
                            }
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 
                                     text-red-400 transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                : getPaginatedData(cycles).data.map((cycle) => (
                    <tr key={cycle.id} className="hover:bg-white/5">
                      <td className="px-6 py-4">
                        <img
                          src={
                            cycle.imageLinks[0] || "/api/placeholder/100/100"
                          }
                          alt={cycle.brand}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 text-white">{cycle.brand}</td>
                      <td className="px-6 py-4 text-white">
                        {cycle.subtitle || "-"}
                      </td>
                      <td className="px-6 py-4 text-white">
                        ₹{cycle.costPerCycle}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {cycle.bundleSize}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(cycle.id)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 
                                     text-white transition-all duration-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cycle.id, "cycle")}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 
                                     text-red-400 transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-white">
          <div>
            Page {page} of{" "}
            {
              getPaginatedData(activeTab === "customers" ? customers : cycles)
                .totalPages
            }
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setPage((prev) =>
                  Math.min(
                    getPaginatedData(
                      activeTab === "customers" ? customers : cycles
                    ).totalPages,
                    prev + 1
                  )
                )
              }
              disabled={
                page ===
                getPaginatedData(activeTab === "customers" ? customers : cycles)
                  .totalPages
              }
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
