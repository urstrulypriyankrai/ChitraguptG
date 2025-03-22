import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PageHeading from "@/app/_components/PageHeading";
import BillActions from "./bill-actions";
import { BillItem } from "@/lib/types/Bill";

export const metadata: Metadata = {
  title: "Bill Details | ChitraguptG",
  description: "View bill details and print or share invoices",
};

async function getBill(id: string) {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/sales/bill/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch bill");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching bill:", error);
    return null;
  }
}

export default async function BillPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const bill = await getBill(id);

  if (!bill) {
    notFound();
  }

  const isFarmerSale = bill.type === "FARMER_SALE";
  const party = isFarmerSale ? bill.farmer : bill.retailer;

  // Format date
  const billDate = new Date(bill.billDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Calculate totals
  const subtotal = bill.items.reduce(
    (sum: number, item: BillItem) => sum + item.subtotal,
    0
  );
  const discountTotal = bill.items.reduce(
    (sum: number, item: BillItem) => sum + item.discountAmount,
    0
  );
  const gstTotal = bill.items.reduce(
    (sum: number, item: BillItem) => sum + item.gstAmount,
    0
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <PageHeading heading={`Bill #${bill.billNumber}`} />
        <BillActions bill={bill} />
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Bill Details</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bill Number:</span>
                  <span>{bill.billNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{billDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span
                    className={`font-medium ${
                      bill.status === "COMPLETED"
                        ? "text-green-600"
                        : bill.status === "CANCELLED"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {bill.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <span
                    className={`font-medium ${
                      bill.paymentStatus === "PAID"
                        ? "text-green-600"
                        : bill.paymentStatus === "UNPAID"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {bill.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span>{bill.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                {isFarmerSale ? "Farmer" : "Retailer"} Details
              </h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{party.name}</span>
                </div>
                {!isFarmerSale && party.gstNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST Number:</span>
                    <span>{party.gstNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mobile:</span>
                  <span>{party.mobile || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="text-right">
                    {party.address ? (
                      <>
                        {[
                          party.address.village,
                          party.address.street,
                          party.address.district,
                          party.address.state,
                          party.address.zip,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-lg font-semibold mb-4">Items</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-2 text-left border">Product</th>
              <th className="px-4 py-2 text-left border">HSN</th>
              <th className="px-4 py-2 text-right border">Qty</th>
              <th className="px-4 py-2 text-right border">Price</th>
              <th className="px-4 py-2 text-right border">Discount</th>
              <th className="px-4 py-2 text-right border">GST</th>
              <th className="px-4 py-2 text-right border">Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map(
              (item: {
                product: {
                  name: string;
                };
                variant: {
                  weight: number;
                  quantityUnitName: string;
                };
                hsnCode: string;
                quantity: number;
                price: string;
                id: number;
                discount: number;
                discountAmount: string;
                gstRate: string;
                gstAmount: string;
                total: string;
              }) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2 border">
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.variant.weight} {item.variant.quantityUnitName}
                    </div>
                  </td>
                  <td className="px-4 py-2 border">{item.hsnCode || "N/A"}</td>
                  <td className="px-4 py-2 text-right border">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-2 text-right border">
                    ₹{parseInt(item.price).toFixed()}
                  </td>
                  <td className="px-4 py-2 text-right border">
                    {item.discount > 0 ? (
                      <>
                        {item.discount}%{" "}
                        <span className="text-muted-foreground">
                          (₹{parseInt(item.discountAmount).toFixed(2)})
                        </span>
                      </>
                    ) : (
                      "0%"
                    )}
                  </td>
                  <td className="px-4 py-2 text-right border">
                    {item.gstRate === "ZERO"
                      ? "0%"
                      : item.gstRate === "FIVE"
                      ? "5%"
                      : item.gstRate === "TWELVE"
                      ? "12%"
                      : item.gstRate === "EIGHTEEN"
                      ? "18%"
                      : item.gstRate === "TWENTY_EIGHT"
                      ? "28%"
                      : "N/A"}
                    <span className="text-muted-foreground">
                      {" "}
                      (₹{parseInt(item.gstAmount).toFixed(2)})
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right font-medium border">
                    ₹{parseFloat(item.total).toFixed()}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-end mb-6">
        <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>₹{parseFloat(subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discount:</span>
            <span>₹{parseFloat(discountTotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">GST:</span>
            <span>₹{parseFloat(gstTotal).toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>₹{parseFloat(bill.totalAmount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Paid:</span>
            <span>₹{parseFloat(bill.amountPaid).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Balance Due:</span>
            <span className={bill.balance > 0 ? "text-red-600" : ""}>
              ₹{parseFloat(bill.balance).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 text-sm text-muted-foreground">
        <p>Thank you for your business!</p>
        <p>
          For any queries related to this bill, please contact us at
          info@chitraguptg.com or call +91 9876543210.
        </p>
      </div>
    </div>
  );
}
