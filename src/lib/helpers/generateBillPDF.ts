import { jsPDF } from "jspdf";
// import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import LogoImage from "@/assets/1.SKE-LOGO.png";
interface BillItem {
  productName: string;
  variantDetails: string;
  quantity: number;
  price: number;
  discount: number;
  gstRate: string;
  hsnCode: string;
  subtotal: number;
  discountAmount: number;
  gstAmount: number;
  total: number;
}

interface BillData {
  billNumber: string;
  billDate: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  farmer?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  retailer?: any;
  items: BillItem[];
  totalAmount: number;
  amountPaid: number;
  balance: number;
  paymentMethod: string;
  paymentStatus: string;
}

export async function generateBillPDF(
  billData: BillData,
  action: "print" | "download" | "share"
): Promise<Blob | null> {
  // Create a new PDF document
  const doc = new jsPDF();

  // Optionally add the company logo image if available
  const logoImage = LogoImage.src;
  if (logoImage) {
    // Add the image at x:15, y:10 with a width of 40 and height of 40 (adjust as needed)
    doc.addImage(logoImage, "PNG", 15, 1, 51, 51);
  }

  // Set font
  doc.setFont("helvetica");

  // Add company header below the logo (centered horizontally)
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(String(process.env.NEXT_PUBLIC_COMPANY_NAME), 136, 20, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.text(String(process.env.NEXT_PUBLIC_COMPANY_GSTIN), 136, 28, {
    align: "center",
  });

  doc.setFontSize(10);

  doc.text(String(process.env.NEXT_PUBLIC_COMPANY_ADDRESS), 136, 35, {
    align: "center",
  });
  doc.text(String(process.env.NEXT_PUBLIC_COMPANY_COMMUNICATION), 136, 40, {
    align: "center",
  });

  // Add horizontal line
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(15, 45, 195, 45);

  // Bill details
  doc.setFontSize(14);
  doc.text("INVOICE", 15, 55);

  doc.setFontSize(10);
  doc.text(`Bill Number: ${billData.billNumber}`, 15, 62);
  doc.text(
    `Date: ${new Date(billData.billDate).toLocaleDateString("en-IN")}`,
    15,
    68
  );

  // Customer details
  const customer = billData.farmer || billData.retailer;
  const customerType = billData.farmer ? "Farmer" : "Retailer";

  doc.setFontSize(12);
  doc.text(`${customerType} Details:`, 130, 55);

  doc.setFontSize(10);
  doc.text(`Name: ${customer?.name || "N/A"}`, 130, 62);

  if (billData.retailer && billData.retailer.gstNumber) {
    doc.text(`GST: ${billData.retailer.gstNumber}`, 130, 68);
  }

  doc.text(
    `Mobile: ${customer?.mobile || "N/A"}`,
    130,
    billData.retailer?.gstNumber ? 74 : 68
  );

  // Address
  const address = customer?.address;
  let addressText = "";

  if (address) {
    const addressParts = [
      address.village,
      address.street,
      address.district,
      address.state,
      address.zip,
    ].filter(Boolean);

    addressText = addressParts.join(", ");
  } else {
    addressText = "Address not available";
  }

  // Wrap address text if it's too long
  const addressLines = doc.splitTextToSize(addressText, 65);
  doc.text(addressLines, 130, billData.retailer?.gstNumber ? 80 : 74);

  // Items table
  const startY = billData.retailer?.gstNumber ? 95 : 85;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - jspdf-autotable types

  autoTable(doc, {
    startY: startY,
    head: [["#", "Product", "HSN", "Qty", "Price", "Discount", "GST", "Total"]],
    body: billData.items.map((item, index) => [
      index + 1,
      `${item.productName}\n${item.variantDetails}`,
      item.hsnCode || "N/A",
      item.quantity,
      `₹${item.price.toString()}`,
      `${item.discount}% (₹${item.discountAmount})`,
      `${
        item.gstRate === "ZERO"
          ? "0%"
          : item.gstRate === "FIVE"
          ? "5%"
          : item.gstRate === "TWELVE"
          ? "12%"
          : item.gstRate === "EIGHTEEN"
          ? "18%"
          : item.gstRate === "TWENTY_EIGHT"
          ? "28%"
          : "N/A"
      } (₹${item.gstAmount})`,
      `₹${item.total}`,
    ]),
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: [80, 80, 80] },
    margin: { top: 10, right: 15, bottom: 10, left: 15 },
  });

  // Get the final Y position after the table
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable?.finalY || 200;
  // Summary section
  doc.setFontSize(10);
  doc.text("Payment Summary:", 130, finalY + 10);
  doc.text(
    `Total Amount: ₹${Number(billData.totalAmount).toFixed(2)}`,
    130,
    finalY + 17
  );
  doc.text(
    `Amount Paid: ₹${Number(billData.amountPaid).toFixed(2)}`,
    130,
    finalY + 24
  );
  doc.text(
    `Balance Due: ₹${Number(billData.balance).toFixed(2)}`,
    130,
    finalY + 31
  );
  doc.text(`Payment Method: ${billData.paymentMethod}`, 130, finalY + 38);
  doc.text(`Payment Status: ${billData.paymentStatus}`, 130, finalY + 45);

  // Terms and conditions
  doc.setFontSize(9);
  doc.text("Terms & Conditions:", 15, finalY + 60);
  doc.text(
    "1. Goods once sold will not be taken back or exchanged.",
    15,
    finalY + 67
  );
  doc.text(
    "2. All disputes are subject to local jurisdiction only.",
    15,
    finalY + 74
  );

  // Signature
  doc.text("FOR " + process.env.NEXT_PUBLIC_COMPANY_NAME, 150, finalY + 67);
  doc.text("Authorized Signatory", 150, finalY + 80);

  // Footer
  doc.setFontSize(8);
  doc.text("Thank you for your business!", 105, 285, { align: "center" });

  // Handle the action based on the parameter
  if (action === "print") {
    doc.autoPrint();
    window.open(URL.createObjectURL(doc.output("blob")));
    return null;
  } else if (action === "download") {
    doc.save(`Bill-${billData.billNumber}.pdf`);
    return null;
  } else if (action === "share") {
    return doc.output("blob");
  }

  return null;
}
