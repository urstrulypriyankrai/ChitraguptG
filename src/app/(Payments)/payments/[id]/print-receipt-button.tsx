"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateReceiptPDF } from "@/lib/helpers/generateReceiptPDF";

interface PrintReceiptButtonProps {
  payment: any;
}

export default function PrintReceiptButton({
  payment,
}: PrintReceiptButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePrintReceipt = async () => {
    setIsLoading(true);

    try {
      const receiptData = {
        paymentId: payment.id,
        paymentDate: payment.paymentDate,
        amount: Number(payment.amount),
        reference: payment.reference,
        party: {
          name: payment.party?.name || "N/A",
          partyType: payment.party?.partyType || "N/A",
          mobile: payment.party?.mobile || "N/A",
          address: payment.party?.address || null,
        },
      };

      await generateReceiptPDF(receiptData, "print");

      toast({
        title: "Receipt generated",
        description: "The receipt has been generated and sent to print.",
      });
    } catch (error) {
      console.error("Error printing receipt:", error);
      toast({
        title: "Failed to print receipt",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={handlePrintReceipt}
      disabled={isLoading}
    >
      <Printer className="h-4 w-4" />
      {isLoading ? "Printing..." : "Print Receipt"}
    </Button>
  );
}
