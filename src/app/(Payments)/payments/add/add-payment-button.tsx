"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddPaymentButtonProps {
  partyId?: string;
  partyType?: string;
}

export default function AddPaymentButton({
  partyId,
  partyType,
}: AddPaymentButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    let url = "/payments/add";

    if (partyId) {
      if (partyType === "FARMER") {
        url += `?farmerId=${partyId}`;
      } else if (partyType === "RETAILER") {
        url += `?retailerId=${partyId}`;
      }
    }

    router.push(url);
  };

  return (
    <Button onClick={handleClick} className="gap-2">
      <Plus className="h-4 w-4" /> Add Payment
    </Button>
  );
}
