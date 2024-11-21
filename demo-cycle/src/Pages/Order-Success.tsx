import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Home,
  ShoppingBag,
  Download,
  Loader,
  Share2,
} from "lucide-react";
import {
  downloadPDF,
  generateOrderPDF,
  previewPDF,
} from "../utils/PdfGenerator";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  // const orderDetails = location.state?.orderDetails;

  // const location = useLocation();
  // const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const handleDownload = async () => {
    setIsGeneratingPDF(true);
    try {
      await downloadPDF(orderDetails);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    // Redirect if no order details
    if (!location.state?.orderDetails) {
      navigate("/");
      return;
    }

    setOrderDetails(location.state.orderDetails);

    // Generate PDF blob on page load
    const generatePDFBlob = async () => {
      try {
        const doc = await generateOrderPDF(location.state.orderDetails);
        const pdfDataUri = doc.output("datauristring");
        const blob = await (await fetch(pdfDataUri)).blob();
        setPdfBlob(blob);
      } catch (error) {
        console.error("Error generating PDF blob:", error);
      }
    };

    generatePDFBlob();
  }, [location, navigate]);

  const handleWhatsAppShare = async () => {
    if (!pdfBlob) return;

    try {
      // Create a file object from the blob
      const pdfFile = new File(
        [pdfBlob],
        `Invoice-${orderDetails.orderId}.pdf`,
        {
          type: "application/pdf",
        }
      );

      // Check if Web Share API is supported
      if (navigator.share && (navigator as any).canShare) {
        await navigator.share({
          title: `Invoice ${orderDetails.orderId}`,
          text: `Invoice for Order ${orderDetails.orderId}`,
          files: [pdfFile],
        });
      } else {
        // Fallback for WhatsApp sharing on desktop
        const url = URL.createObjectURL(pdfBlob);
        const whatsappUrl = `https://web.whatsapp.com/send?text=Invoice for Order ${orderDetails.orderId}: ${url}`;
        window.open(whatsappUrl, "_blank");
      }
    } catch (error) {
      console.error("Sharing error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <CheckCircle className="w-16 h-16 text-green-400 opacity-25" />
            </div>
            <CheckCircle className="w-16 h-16 text-green-400 relative" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-white">
            Order Successful!
          </h1>

          <p className="mt-4 text-lg text-white/90">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div className="mt-8 w-full space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3 text-white/90">
                <ShoppingBag className="w-5 h-5" />
                <span>Order ID</span>
              </div>
              <span className="text-white font-medium">
                {orderDetails?.orderId}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3 text-white/90">
                <span>Total Amount</span>
              </div>
              <span className="text-white font-medium">
                ₹{orderDetails?.pricing.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 w-full">
            <button
              onClick={handleDownload}
              disabled={isGeneratingPDF}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-green-500/20 hover:bg-green-500/30 rounded-xl text-white font-medium transition-all duration-300 w-full"
            >
              {isGeneratingPDF ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isGeneratingPDF ? "Generating PDF..." : "Download Invoice"}
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              Return to Home
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition"
            >
              <Share2 className="h-5 w-5" />
              Share on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
