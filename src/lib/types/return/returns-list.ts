export interface ReturnData {
  id: string;
  returnDate: string;
  returnNumber: string;
  party: {
    name: string;
    partyType: "FARMER" | "RETAILER";
  };
  totalAmount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
}
