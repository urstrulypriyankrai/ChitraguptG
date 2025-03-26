"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, Printer, Download, Share2 } from "lucide-react";
import { generateBillPDF } from "@/lib/helpers/generateBillPDF";
import { Address, GSTRATE, Party } from "@prisma/client";
import { ProductType } from "@/lib/types/Product/product";
import { ProductVariantType } from "@/lib/types/Product/ProductVariantType";

// const initialFarmerData = {
//   name: "",
//   id: "",
//   partyType: "FARMER",
//   mobile: "",
//   email: null,
//   fathersName: "",
//   aadhar: "",
//   creditBalance: 0,
//   gstNumber: null,
//   addressId: null,
//   productId: null,
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

export default function FarmerSalesForm({
  farmers,
  products,
}: FarmerSalesFormProps) {
  const router = useRouter();

  const [selectedFarmer, setSelectedFarmer] = useState<string>("");
  const [farmerDetails, setFarmerDetails] = useState<PartyWithAddress | null>(
    null
  );
  const [selectedItems, setSelectedItems] = useState<
    Array<{
      productId: string;
      variantId: string;
      quantity: number;
      price: number;
      discount: number;
      gstRate: string;
      hsnCode: string;
    }>
  >([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [billNumber, setBillNumber] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billDate, setBillDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Generate a bill number when component mounts/loads
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    setBillNumber(`F${year}${month}${day}/${random}`);
  }, []);

  // Update farmer details when a farmer is selected
  useEffect(() => {
    if (selectedFarmer) {
      const farmer = farmers.find((f) => f.id === selectedFarmer);
      if (farmer) setFarmerDetails(farmer);
    } else {
      setFarmerDetails(null);
    }
  }, [selectedFarmer, farmers]);

  const addItem = () => {
    setSelectedItems([
      ...selectedItems,
      {
        productId: "",
        variantId: "",
        quantity: 1,
        price: 0,
        discount: 0,
        gstRate: "",
        hsnCode: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const updatedItems = [...selectedItems];

    if (field === "productId" && typeof value === "string") {
      updatedItems[index].productId = value;
      const product = products.find((p) => p.id === value);
      if (product) {
        updatedItems[index].gstRate = product.tax.gstRate as GSTRATE;
        updatedItems[index].hsnCode = product.tax.hsnCode as string;
      }
      if (product && product.variants && product.variants.length > 0) {
        const variant = product.variants[index];
        updatedItems[index] = {
          ...updatedItems[index],
          productId: value,
          price: variant.MRP || 0,
          // gstRate: product.tax?.gstRate || "",
          // hsnCode: product.tax?.hsnCode || "",
        };
      }
    } else if (field === "variantId" && typeof value === "string") {
      const product = products.find(
        (p) => p.id === updatedItems[index].productId
      );
      if (product) {
        const variant = product.variants.find(
          (v: ProductVariantType) => v.id === value
        );
        if (variant) {
          updatedItems[index] = {
            ...updatedItems[index],
            variantId: value,
            price: variant.MRP || 0,
          };
        }
      }
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
    }

    setSelectedItems(updatedItems);
  };

  const calculateSubtotal = (item: variantPriceData) => {
    return item.price * item.quantity;
  };

  const calculateDiscount = (item: variantPriceData) => {
    return (calculateSubtotal(item) * item.discount) / 100;
  };

  const calculateGST = (item: variantPriceData) => {
    const afterDiscount = calculateSubtotal(item) - calculateDiscount(item);
    let gstRate = 0;

    switch (item.gstRate) {
      case "ZERO":
        gstRate = 0;
        break;
      case "FIVE":
        gstRate = 5;
        break;
      case "TWELVE":
        gstRate = 12;
        break;
      case "EIGHTEEN":
        gstRate = 18;
        break;
      case "TWENTY_EIGHT":
        gstRate = 28;
        break;
      default:
        gstRate = 0;
    }

    return (afterDiscount * gstRate) / 100;
  };

  const calculateItemTotal = (item: variantPriceData) => {
    return (
      calculateSubtotal(item) - calculateDiscount(item) + calculateGST(item)
    );
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      return total + calculateItemTotal(item);
    }, 0);
  };

  const calculateBalance = () => {
    return calculateTotal() - amountPaid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFarmer) {
      toast({ title: "Please select a farmer", variant: "destructive" });
      return;
    }

    if (selectedItems.length === 0) {
      toast({
        title: "Please add at least one product",
        variant: "destructive",
      });
      return;
    }

    // Validate all items have product and variant selected
    const invalidItems = selectedItems.filter(
      (item) => !item.productId || !item.variantId
    );
    if (invalidItems.length > 0) {
      toast({
        title: "Please select product and variant for all items",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log(selectedItems[0].gstRate, "GST RATE");

    try {
      const saleData = {
        billNumber,
        billDate,
        farmerId: selectedFarmer,
        items: selectedItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          gstRate: item.gstRate,
          hsnCode: item.hsnCode,
          subtotal: calculateSubtotal(item),
          discountAmount: calculateDiscount(item),
          gstAmount: calculateGST(item),
          total: calculateItemTotal(item),
        })),
        totalAmount: calculateTotal(),
        amountPaid,
        balance: calculateBalance(),
        paymentMethod,
        paymentStatus:
          amountPaid >= calculateTotal()
            ? "PAID"
            : amountPaid > 0
            ? "PARTIAL"
            : "UNPAID",
        status: "COMPLETED",
      };
      console.log(saleData, "from here");
      const response = await fetch("/api/sales/farmer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({ title: "Sale completed successfully", variant: "default" });

        // Redirect to bill view page
        router.push(`/sales/bill/${result.id}`);
        router.refresh();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to create sale");
      }
    } catch (error) {
      console.error("Error creating sale:", error);
      toast({
        title: "Failed to create sale",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintBill = async () => {
    if (!selectedFarmer || selectedItems.length === 0) {
      toast({
        title: "Please complete the bill first",
        variant: "destructive",
      });
      return;
    }

    try {
      const billData = {
        billNumber,
        billDate,
        farmer: farmerDetails,
        items: selectedItems.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          const variant = product?.variants.find(
            (v: ProductVariantType) => v.id === item.variantId
          );
          return {
            productName: product?.name || "",
            variantDetails: variant
              ? `${variant.weight} ${variant.quantityUnitName}`
              : "",
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            gstRate: item.gstRate,
            hsnCode: item.hsnCode,
            subtotal: calculateSubtotal(item),
            discountAmount: calculateDiscount(item),
            gstAmount: calculateGST(item),
            total: calculateItemTotal(item),
          };
        }),
        totalAmount: calculateTotal(),
        amountPaid,
        balance: calculateBalance(),
        paymentMethod,
        paymentStatus:
          amountPaid >= calculateTotal()
            ? "PAID"
            : amountPaid > 0
            ? "PARTIAL"
            : "UNPAID",
      };

      await generateBillPDF(billData, "print");
    } catch (error) {
      console.error("Error printing bill:", error);
      toast({
        title: "Failed to print bill",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleDownloadBill = async () => {
    if (!selectedFarmer || selectedItems.length === 0) {
      toast({
        title: "Please complete the bill first",
        variant: "destructive",
      });
      return;
    }

    try {
      const billData = {
        billNumber,
        billDate,
        farmer: farmerDetails,
        items: selectedItems.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          const variant = product?.variants.find(
            (v: ProductVariantType) => v.id === item.variantId
          );
          return {
            productName: product?.name || "",
            variantDetails: variant
              ? `${variant.weight} ${variant.quantityUnitName}`
              : "",
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            gstRate: item.gstRate,
            hsnCode: item.hsnCode,
            subtotal: calculateSubtotal(item),
            discountAmount: calculateDiscount(item),
            gstAmount: calculateGST(item),
            total: calculateItemTotal(item),
          };
        }),
        totalAmount: calculateTotal(),
        amountPaid,
        balance: calculateBalance(),
        paymentMethod,
        paymentStatus:
          amountPaid >= calculateTotal()
            ? "PAID"
            : amountPaid > 0
            ? "PARTIAL"
            : "UNPAID",
      };

      await generateBillPDF(billData, "download");
    } catch (error) {
      console.error("Error downloading bill:", error);
      toast({
        title: "Failed to download bill",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleShareBill = async () => {
    if (!selectedFarmer || selectedItems.length === 0) {
      toast({
        title: "Please complete the bill first",
        variant: "destructive",
      });
      return;
    }

    try {
      const billData = {
        billNumber,
        billDate,
        farmer: farmerDetails,
        items: selectedItems.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          const variant = product?.variants.find(
            (v: ProductVariantType) => v.id === item.variantId
          );
          return {
            productName: product?.name || "",
            variantDetails: variant
              ? `${variant.weight} ${variant.quantityUnitName}`
              : "",
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            gstRate: item.gstRate,
            hsnCode: item.hsnCode,
            subtotal: calculateSubtotal(item),
            discountAmount: calculateDiscount(item),
            gstAmount: calculateGST(item),
            total: calculateItemTotal(item),
          };
        }),
        totalAmount: calculateTotal(),
        amountPaid,
        balance: calculateBalance(),
        paymentMethod,
        paymentStatus:
          amountPaid >= calculateTotal()
            ? "PAID"
            : amountPaid > 0
            ? "PARTIAL"
            : "UNPAID",
      };

      const pdfBlob = await generateBillPDF(billData, "share");

      if (navigator.share && pdfBlob) {
        const file = new File([pdfBlob], `Bill-${billNumber}.pdf`, {
          type: "application/pdf",
        });
        await navigator.share({
          title: `Bill #${billNumber}`,
          text: `Bill for ${farmerDetails?.name || "Farmer"}`,
          files: [file],
        });
      } else if (pdfBlob) {
        // Fallback for browsers that don't support navigator.share with files
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const phoneNumber = farmerDetails?.mobile;

        if (phoneNumber) {
          // Create WhatsApp share link
          const message = encodeURIComponent(
            `Bill #${billNumber} for amount ₹${calculateTotal().toFixed(2)}`
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="billNumber">Bill Number</Label>
          <Input
            id="billNumber"
            value={billNumber}
            onChange={(e) => setBillNumber(e.target.value)}
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="billDate">Bill Date</Label>
          <Input
            id="billDate"
            type="date"
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="farmer">Select Farmer</Label>
          <Select value={selectedFarmer} onValueChange={setSelectedFarmer}>
            <SelectTrigger id="farmer" className="mt-1">
              <SelectValue placeholder="Select a farmer" />
            </SelectTrigger>
            <SelectContent>
              {farmers.map((farmer) => (
                <SelectItem key={farmer.id} value={farmer.id}>
                  {farmer.name} - {farmer.address?.village || "N/A"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {farmerDetails && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p>{farmerDetails.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Mobile</p>
                <p>{farmerDetails.mobile || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Address</p>
                <p>
                  {[
                    farmerDetails.address?.village,
                    farmerDetails.address?.district,
                    farmerDetails.address?.state,
                    farmerDetails.address?.zip,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Id</p>
                <p>{farmerDetails.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Products</h3>

          <Button
            type="button"
            onClick={addItem}
            variant="outline"
            size="sm"
            disabled={!Boolean(selectedFarmer.length)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </div>

        {selectedItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-md">
            No products added. Click Add Product to begin.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Variant</th>
                  <th className="px-4 py-2 text-left">Qty</th>
                  <th className="px-4 py-2 text-left">Price (₹)</th>
                  <th className="px-4 py-2 text-left">Discount (%)</th>
                  <th className="px-4 py-2 text-left">GST</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item, index) => {
                  const product = products.find((p) => p.id === item.productId);
                  console.log(item, "from here");

                  return (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">
                        <Select
                          value={item.productId}
                          onValueChange={(value) => {
                            updateItem(index, "productId", value);
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={item.variantId}
                          onValueChange={(value) => {
                            updateItem(index, "variantId", value);
                            console.log("#here", value);
                          }}
                          disabled={!item.productId}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select variant" />
                          </SelectTrigger>
                          <SelectContent>
                            {product?.variants.map(
                              (variant: ProductVariantType) => (
                                <SelectItem
                                  key={variant.id}
                                  value={variant.id as string}
                                >
                                  {variant.weight} {variant.quantityUnitName}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              Number.parseInt(e.target.value) || 1
                            )
                          }
                          className="w-20"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "price",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-24"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "discount",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-20"
                        />
                      </td>
                      <td className="px-4 py-2">
                        {item.gstRate ? (
                          <span>
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
                              : ""}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-4 py-2 font-medium">
                        ₹{calculateItemTotal(item).toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          type="button"
                          onClick={() => removeItem(index)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className="px-4 py-2 text-right font-medium">
                    Total Amount:
                  </td>
                  <td className="px-4 py-2 font-bold">
                    ₹{calculateTotal().toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
        <div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="paymentMethod" className="mt-1">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CREDIT">Credit (Pay Later)</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="BANK">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amountPaid">Amount Paid</Label>
              <Input
                id="amountPaid"
                type="number"
                min="0"
                step="0.01"
                value={amountPaid}
                onChange={(e) =>
                  setAmountPaid(Number.parseFloat(e.target.value) || 0)
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label>Balance</Label>
              <div className="mt-1 p-2 border rounded-md bg-muted/30">
                ₹{calculateBalance().toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end space-y-4">
          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrintBill}
              disabled={selectedItems.length === 0 || !selectedFarmer}
            >
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadBill}
              disabled={selectedItems.length === 0 || !selectedFarmer}
            >
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleShareBill}
              disabled={selectedItems.length === 0 || !selectedFarmer}
            >
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isSubmitting || selectedItems.length === 0 || !selectedFarmer
              }
            >
              {isSubmitting ? "Processing..." : "Complete Sale"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

// ========= TYPE INIT ===========

type PartyWithAddress = Party & {
  address?: Address;
};
interface FarmerSalesFormProps {
  farmers: PartyWithAddress[];
  products: ProductType[];
}

type variantPriceData = {
  price: number;
  quantity: number;
  discount: number;
  gstRate: string;
};
