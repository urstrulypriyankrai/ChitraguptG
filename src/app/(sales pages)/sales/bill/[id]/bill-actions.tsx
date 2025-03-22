"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateBillPDF } from "@/lib/helpers/generateBillPDF";

export default function BillActions({ bill }: { bill: any }) {
  const [isLoading, setIsLoading] = useState({
    print: false,
    download: false,
    share: false,
  });

  const isFarmerSale = bill.type === "FARMER_SALE";
  const party = isFarmerSale ? bill.farmer : bill.retailer;

  const handlePrintBill = async () => {
    setIsLoading({ ...isLoading, print: true });

    try {
      const billData = {
        billNumber: bill.billNumber,
        billDate: bill.billDate,
        [isFarmerSale ? "farmer" : "retailer"]: party,
        items: bill.items.map((item: any) => ({
          productName: item.product.name as string,
          variantDetails:
            `${item.variant.weight} ${item.variant.quantityUnitName}` as string,
          quantity: parseInt(item.quantity),
          price: parseInt(item.price),
          discount: parseInt(item.discount),
          gstRate: item.gstRate as string,
          hsnCode: item.hsnCode,
          subtotal: parseInt(item.subtotal),
          discountAmount: parseInt(item.discountAmount),
          gstAmount: parseInt(item.gstAmount),
          total: parseInt(item.total),
        })),
        totalAmount: parseInt(bill.totalAmount),
        amountPaid: parseInt(bill.amountPaid),
        balance: parseInt(bill.balance),
        paymentMethod: bill.paymentMethod,
        paymentStatus: bill.paymentStatus,
      };

      await generateBillPDF(billData, "print");
    } catch (error) {
      console.error("Error printing bill:", error);
      toast({
        title: "Failed to print bill",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading({ ...isLoading, print: false });
    }
  };

  const handleDownloadBill = async () => {
    setIsLoading({ ...isLoading, download: true });

    try {
      const billData = {
        billNumber: bill.billNumber,
        billDate: bill.billDate,
        [isFarmerSale ? "farmer" : "retailer"]: party,
        items: bill.items.map((item: any) => ({
          productName: item.product.name,
          variantDetails: `${item.variant.weight} ${item.variant.quantityUnitName}`,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          gstRate: item.gstRate,
          hsnCode: item.hsnCode,
          subtotal: item.subtotal,
          discountAmount: item.discountAmount,
          gstAmount: item.gstAmount,
          total: item.total,
        })),
        totalAmount: bill.totalAmount,
        amountPaid: bill.amountPaid,
        balance: bill.balance,
        paymentMethod: bill.paymentMethod,
        paymentStatus: bill.paymentStatus,
      };

      await generateBillPDF(billData, "download");
    } catch (error) {
      console.error("Error downloading bill:", error);
      toast({
        title: "Failed to download bill",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading({ ...isLoading, download: false });
    }
  };

  const handleShareBill = async () => {
    setIsLoading({ ...isLoading, share: true });

    try {
      const billData = {
        billNumber: bill.billNumber,
        billDate: bill.billDate,
        [isFarmerSale ? "farmer" : "retailer"]: party,
        items: bill.items.map((item: any) => ({
          productName: item.product.name,
          variantDetails: `${item.variant.weight} ${item.variant.quantityUnitName}`,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          gstRate: item.gstRate,
          hsnCode: item.hsnCode,
          subtotal: item.subtotal,
          discountAmount: item.discountAmount,
          gstAmount: item.gstAmount,
          total: item.total,
        })),
        totalAmount: bill.totalAmount,
        amountPaid: bill.amountPaid,
        balance: bill.balance,
        paymentMethod: bill.paymentMethod,
        paymentStatus: bill.paymentStatus,
      };

      const pdfBlob = await generateBillPDF(billData, "share");

      if (navigator.share && pdfBlob) {
        const file = new File([pdfBlob], `Bill-${bill.billNumber}.pdf`, {
          type: "application/pdf",
        });
        await navigator.share({
          title: `Bill #${bill.billNumber}`,
          text: `Bill for ${party?.name || "Customer"}`,
          files: [file],
        });
      } else if (pdfBlob) {
        // Fallback for browsers that don't support navigator.share with files
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const phoneNumber = party?.mobile;

        if (phoneNumber) {
          // Create WhatsApp share link
          const message = encodeURIComponent(
            `Bill #${bill.billNumber} for amount ₹${bill.totalAmount.toFixed(
              2
            )}`
          );
          window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");

          // Also open the PDF in a new tab so they can download it
          window.open(pdfUrl, "_blank");
        } else {
          window.open(pdfUrl, "_blank");
        }
      }
    } catch (error) {
      console.error("Error sharing bill:", error);
      toast({
        title: "Failed to share bill",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading({ ...isLoading, share: false });
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        onClick={handlePrintBill}
        disabled={isLoading.print}
      >
        <Printer className="h-4 w-4 mr-2" />
        {isLoading.print ? "Printing..." : "Print"}
      </Button>

      <Button
        variant="outline"
        onClick={handleDownloadBill}
        disabled={isLoading.download}
      >
        <Download className="h-4 w-4 mr-2" />
        {isLoading.download ? "Downloading..." : "Download"}
      </Button>

      <Button
        variant="outline"
        onClick={handleShareBill}
        disabled={isLoading.share}
      >
        <Share2 className="h-4 w-4 mr-2" />
        {isLoading.share ? "Sharing..." : "Share"}
      </Button>
    </div>
  );
}

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
