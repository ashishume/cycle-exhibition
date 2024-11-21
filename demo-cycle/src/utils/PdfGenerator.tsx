import jsPDF from "jspdf";

export const generateOrderPDF = async (orderDetails: any) => {
  try {
    const {
      orderId,
      customer,
      products,
      pricing,
      remarks,
      orderDate = new Date().toLocaleString("en-IN", {
        dateStyle: "long",
        timeStyle: "short",
      }),
    } = orderDetails;

    // Create new document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Helper for center alignment
    const centerText = (text: any, y: any) => {
      const textWidth =
        (doc.getStringUnitWidth(text) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const textOffset = (doc.internal.pageSize.width - textWidth) / 2;
      doc.text(text, textOffset, y);
    };

    // Add company header
    doc.setFillColor(88, 80, 236); // indigo color
    doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");

    // Replace this URL with your actual logo URL or base64 string
    const logoUrl = "/logo.png"; // You need to replace this with actual logo path
    const logoWidth = 60; // Adjust based on your logo's dimensions
    const logoHeight = 20; // Adjust based on your logo's dimensions
    const logoX = (doc.internal.pageSize.width - logoWidth) / 2;

    try {
      const logoImg = await loadImage(logoUrl);
      doc.addImage(logoImg, "PNG", logoX, 5, logoWidth, logoHeight);
    } catch (error) {
      console.error("Error loading logo:", error);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      centerText("Maharaja Bikes", 20);
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    centerText("Invoice", 30);

    // Reset text color for rest of the document
    doc.setTextColor(0, 0, 0);

    // Add order information
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Order Details", 10, 50);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text([`Order ID: ${orderId}`, `Date: ${orderDate}`], 10, 60);

    // Add customer information
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Information", 10, 85);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text([`Name: ${customer.name}`], 10, 95);

    // Add remarks section if present
    let startY = 0;

    if (remarks) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Additional Remarks", 10, 105);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      // Wrap remarks text if it's too long
      const maxWidth = 180;
      const splitRemarks = doc.splitTextToSize(remarks, maxWidth);
      doc.text(splitRemarks, 10, 115);

      startY = 115 + splitRemarks.length * 5;
    } else {
      startY = 110; // Default starting Y if no remarks
    }

    // Products table header
    const columns = [
      "Product",
      "Variant",
      "Quantity",
      "Bundle qty",
      "Tyre",
      "Cost/Product",
      "Add. Cost",
      "Total",
    ];
    const columnWidths = [40, 20, 20, 20, 35, 25, 20, 20];
    let startX = 10;

    // Draw table header
    doc.setFillColor(88, 80, 236);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.rect(
      startX,
      startY,
      columnWidths.reduce((a, b) => a + b, 0),
      10,
      "F"
    );

    columns.forEach((column, index) => {
      const x =
        startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
      doc.text(column, x + 2, startY + 7);
    });

    // Reset text color and font for table body
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    startY += 10;

    // Draw table rows
    products.forEach((product: any, index: any) => {
      const row = [
        product.brand,
        `${product.variant}"`,
        product.totalProducts.toString(),
        (product.totalProducts / product.bundleSize).toString(),
        `${product.tyreType}${
          product.brandType ? "(" + product.brandType + ")" : ""
        }`,
        `Rs.${product.costPerProduct}`,
        `Rs.${product.additionalCost}`,
        `Rs.${product.total}`,
      ];

      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(245, 247, 250);
        doc.rect(
          startX,
          startY,
          columnWidths.reduce((a, b) => a + b, 0),
          10,
          "F"
        );
      }

      row.forEach((text, colIndex) => {
        const x =
          startX + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
        doc.text(text, x + 2, startY + 7);
      });

      startY += 10;
    });

    // Pricing summary
    const finalY = startY + 10;

    // Add box for total
    doc.setDrawColor(88, 80, 236);
    doc.setLineWidth(0.5);
    doc.rect(120, finalY - 5, 70, 45);

    // Pricing details
    doc.text(`Subtotal:`, 125, finalY + 5);
    doc.text(`Rs.${pricing.subtotal.toFixed(2)}`, 170, finalY + 5, {
      align: "right",
    });

    if (pricing.discountApplied) {
      doc.setTextColor(46, 174, 52); // Green color for discount
      doc.text(
        `Discount (${pricing.perCycleDiscountPercent}%):`,
        125,
        finalY + 12
      );
      doc.text(`-Rs.${pricing.discount.toFixed(2)}`, 170, finalY + 12, {
        align: "right",
      });
      doc.setTextColor(0, 0, 0); // Reset to black
    }

    doc.text(`GST (12%):`, 125, finalY + 19);
    doc.text(`Rs.${pricing.gst.toFixed(2)}`, 170, finalY + 19, {
      align: "right",
    });

    // Total
    doc.setFont("helvetica", "bold");
    doc.text(`Total:`, 125, finalY + 26);
    doc.text(`Rs.${pricing.total.toFixed(2)}`, 170, finalY + 26, {
      align: "right",
    });

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);

    const footerText = "Thank you for your business!";
    centerText(footerText, doc.internal.pageSize.height - 20);

    return doc;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
};

export const downloadPDF = async (orderDetails: any) => {
  try {
    if (!orderDetails || !orderDetails.orderId) {
      throw new Error("Invalid order details");
    }

    const doc = await generateOrderPDF(orderDetails);
    const fileName = `Invoice-${
      orderDetails.orderId
    }-${new Date().getTime()}.pdf`;
    doc.save(fileName);

    return true;
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw error;
  }
};

export const previewPDF = async (orderDetails: any) => {
  try {
    const doc = await generateOrderPDF(orderDetails);
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error previewing PDF:", error);
    throw error;
  }
};

const loadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Important for some server configurations

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0);

      try {
        const dataUrl = canvas.toDataURL("image/png");
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};
