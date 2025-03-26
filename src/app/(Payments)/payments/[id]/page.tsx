import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import PageHeading from "@/app/_components/PageHeading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PrintReceiptButton from "./print-receipt-button";

export const metadata: Metadata = {
  title: "Payment Details | ChitraguptG",
  description: "View details of a specific payment",
};

async function getPayment(id: string) {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/payments/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch payment");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching payment:", error);
    return null;
  }
}

export default async function PaymentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payment = await getPayment(id);

  if (!payment) {
    notFound();
  }

  const paymentDate = new Date(payment.createdAt);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <PageHeading heading={`Payment #${payment.id}`} />
        <div className="flex gap-2">
          <Link href="/payments">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Payments
            </Button>
          </Link>
          <PrintReceiptButton payment={payment} />
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID:</span>
                  <span>{payment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{format(paymentDate, "PPP")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="text-green-600 font-medium">
                    ₹{Number(payment.amount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference:</span>
                  <span>{payment.reference || "N/A"}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Party Details</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{payment.party?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{payment.party?.partyType || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mobile:</span>
                  <span>{payment.party?.mobile || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="text-right">
                    {payment.party?.address ? (
                      <>
                        {[
                          payment.party.address.village,
                          payment.party.address.street,
                          payment.party.address.district,
                          payment.party.address.state,
                          payment.party.address.zip,
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

      <div className="border-t pt-4 text-sm text-muted-foreground">
        <p>This payment was recorded on {format(paymentDate, "PPP 'at' p")}.</p>
        <p>
          For any queries related to this payment, please contact the
          administrator.
        </p>
      </div>
    </div>
  );
}
