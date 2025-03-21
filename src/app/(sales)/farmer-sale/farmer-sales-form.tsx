"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Farmer, Product } from "@/../types/index";

interface FarmerSalesFormProps {
  farmers: Farmer[];
  products: Product[];
}

export default function FarmerSalesForm({
  farmers,
  products,
}: FarmerSalesFormProps) {
  const router = useRouter();
  const [selectedFarmer, setSelectedFarmer] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<
    Array<{
      productId: string;
      quantity: number;
      price: number;
      discount: number;
    }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = () => {
    setSelectedItems([
      ...selectedItems,
      { productId: "", quantity: 1, price: 0, discount: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const updatedItems = [...selectedItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setSelectedItems(updatedItems);
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      const itemPrice = item.price || product?.price || 0;
      const itemTotal = itemPrice * item.quantity;
      const discountAmount = (itemTotal * item.discount) / 100;
      return total + (itemTotal - discountAmount);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          farmerId: selectedFarmer,
          items: selectedItems,
          totalAmount: calculateTotal(),
          date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        router.push("/sales/history");
        router.refresh();
      } else {
        throw new Error("Failed to create sale");
      }
    } catch (error) {
      console.error("Error creating sale:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="farmer"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Farmer
          </label>
          <select
            id="farmer"
            value={selectedFarmer}
            onChange={(e) => setSelectedFarmer(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            required
          >
            <option value="">Select a farmer</option>
            {farmers.map((farmer) => (
              <option key={farmer.id} value={farmer.id}>
                {farmer.name} - {farmer.village}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sale Date
          </label>
          <input
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Products</h3>
          <button
            type="button"
            onClick={addItem}
            className="text-primary hover:text-primary-dark"
          >
            + Add Product
          </button>
        </div>

        {selectedItems.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No products added. Click Add Product to begin.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price (₹)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount (%)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedItems.map((item, index) => {
                  const product = products.find((p) => p.id === item.productId);
                  const itemPrice = item.price || product?.price || 0;
                  const itemTotal = itemPrice * item.quantity;
                  const discountAmount = (itemTotal * item.discount) / 100;
                  const finalTotal = itemTotal - discountAmount;

                  return (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <select
                          value={item.productId}
                          onChange={(e) =>
                            updateItem(index, "productId", e.target.value)
                          }
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                          required
                        >
                          <option value="">Select a product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.category})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-20 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price || product?.price || 0}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "price",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-24 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "discount",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-20 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">
                        ₹{finalTotal.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-right font-medium">
                    Total Amount:
                  </td>
                  <td className="px-4 py-3 font-bold">
                    ₹{calculateTotal().toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          <label
            htmlFor="paymentMethod"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Payment Method
          </label>
          <select
            id="paymentMethod"
            className="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            required
          >
            <option value="cash">Cash</option>
            <option value="credit">Credit (Pay Later)</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>

        <div className="space-x-2">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || selectedItems.length === 0}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Complete Sale"}
          </button>
        </div>
      </div>
    </form>
  );
}
