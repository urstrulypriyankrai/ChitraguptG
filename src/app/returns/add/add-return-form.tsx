"use client";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import convertGstRateToNumber from "@/lib/helpers/convertGstRateToNumber";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const itemSchema = z
  .object({
    saleItemId: z.string(),
    productId: z.string(),
    variantId: z.string(),
    originalQuantity: z.number(),
    returnQuantity: z.coerce
      .number()
      .min(1, "Return quantity must be at least 1"),
    price: z.coerce.number(),
    gstRate: z.coerce.number(),
    discountRate: z.coerce.number().default(0),
  })
  .refine((data) => data.returnQuantity <= data.originalQuantity, {
    message: "Cannot return more than purchased",
    path: ["returnQuantity"],
  });

const formSchema = z.object({
  partyId: z.string({ required_error: "Please select a party" }),
  saleId: z.string().optional(),
  date: z.date({ required_error: "Please select a date" }),
  reason: z.string().min(1, "Please provide a reason for the return"),
  updateLedger: z.boolean().default(true),
  items: z.array(itemSchema).min(1, "Please add at least one item"),
});
type FormValues = z.infer<typeof formSchema>;

interface AddReturnFormProps {
  initialPartyId?: string;
  initialPartyType?: string;
}

export default function AddReturnForm({
  initialPartyId,
  initialPartyType,
}: AddReturnFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [parties, setParties] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [partyType, setPartyType] = useState(initialPartyType || "all");
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [isLoadingParties, setIsLoadingParties] = useState(false);
  const [isLoadingSales, setIsLoadingSales] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partyId: initialPartyId || "",
      date: new Date(),
      reason: "",
      updateLedger: true,
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    const fetchParties = async () => {
      setIsLoadingParties(true);
      try {
        const url = `/api/party${
          partyType !== "all" ? `?partyType=${partyType}` : ""
        }`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Failed to fetch parties");
        const data = await response.json();
        setParties(data.party || []);
      } catch (error) {
        console.error("Error fetching parties:", error);
        toast({
          title: "Error",
          description: "Failed to load parties",
          variant: "destructive",
        });
      } finally {
        setIsLoadingParties(false);
      }
    };

    fetchParties();
  }, [partyType]);

  useEffect(() => {
    const fetchSales = async () => {
      const partyId = form.getValues("partyId");
      if (!partyId) return;

      setIsLoadingSales(true);
      try {
        const response = await fetch(`/api/sales/farmer?farmerId=${partyId}`);
        if (!response.ok) throw new Error("Failed to fetch sales");
        const data = await response.json();
        setSales(data);
      } catch (error) {
        console.error("Error fetching sales:", error);
        toast({
          title: "Error",
          description: "Failed to load sales",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSales(false);
      }
    };

    fetchSales();
  }, [form.watch("partyId")]);

  const loadSaleItems = (saleId: string) => {
    setSelectedSaleId(saleId);
    // Find the sale by ID, making sure to compare string values
    const sale = sales.find((s) => String(s.id) === String(saleId));
    if (!sale) return;

    console.log("Selected sale:", sale);
    setSelectedSale(sale);
    // Explicitly convert saleId to string
    form.setValue("saleId", String(saleId));

    // Clear existing items
    form.setValue("items", []);

    // Ensure all IDs are converted to strings
    if (sale.items && Array.isArray(sale.items) && sale.items.length > 0) {
      const mappedItems = sale.items.map((item: any) => {
        return {
          saleItemId: String(item.id),
          productId: String(item.productId),
          variantId: String(item.variantId),
          originalQuantity: Number(item.quantity),
          returnQuantity: Number(item.quantity),
          price: Number(item.price),
          gstRate: convertGstRateToNumber(item.gstRate),
          discountRate: Number(item?.discount) || 0,
        };
      });

      form.setValue("items", mappedItems);
    } else {
      console.error(
        "No items found in the selected sale or invalid items format"
      );
      toast({
        title: "Error",
        description: "No items found in the selected sale",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    const total = form.getValues("items").reduce((total, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.returnQuantity) || 0;
      const gst = Number(item.gstRate) || 0;
      const discount = Number(item.discountRate) || 0;

      const itemTotal = price * qty;
      const taxAmount = itemTotal * (gst / 100);
      const discountAmount = (itemTotal + taxAmount) * (discount / 100);

      return total + itemTotal + taxAmount - discountAmount;
    }, 0);
    return isNaN(total) ? 0 : total;
  };

  const validateAndPrepare = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      const errors = form.formState.errors;
      console.log("Form validation errors:", errors);

      let errorMessage = "Please fix the following errors:";
      if (errors.partyId) errorMessage += " Party selection required.";
      if (errors.date) errorMessage += " Date selection required.";
      if (errors.reason) errorMessage += " Return reason required.";
      if (errors.items) errorMessage += " Item issues: " + errors.items.message;

      toast({
        title: "Form Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateAndPrepare();
    if (!isValid) return;

    setShowConfirmDialog(true);
  };

  const submitForm = async () => {
    setShowConfirmDialog(false);
    const values = form.getValues();
    setIsLoading(true);
    try {
      // Ensure all IDs are strings in the request payload
      const requestData = {
        ...values,
        partyId: values.partyId,
        // Make sure saleId is always a string when sent to API
        saleId: selectedSale?.id ? String(selectedSale.id) : undefined,
        date: values.date.toISOString(),
        totalAmount: calculateTotal(),
        items: values.items,
      };

      const response = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      let responseData;
      try {
        responseData = await response.json();
        console.log("API response data:", responseData);
      } catch (e) {
        if (e instanceof Error) console.error("No JSON in response", e.message);
      }

      if (!response.ok) {
        throw new Error(responseData?.message || "Failed to process return");
      }

      toast({
        title: "Success",
        description: "Return processed successfully",
      });

      // Redirect after short delay to ensure toast is visible
      setTimeout(() => {
        window.location.href = "/returns";
      }, 1500);
    } catch (error) {
      console.error("Error processing return:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to process return",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  function formatDate(date: Date | string): string {
    if (!date) return "";

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "PPP");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                control={form.control}
                name="partyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Party</FormLabel>
                    <Select
                      disabled={isLoading || !!initialPartyId}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a party" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {parties.map((party) => (
                          <SelectItem key={party.id} value={party.id}>
                            {party.name} ({party.partyType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the returning party
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Return Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-40">
                <FormLabel>Filter By Type</FormLabel>
                <Select
                  disabled={!!initialPartyType}
                  onValueChange={setPartyType}
                  value={partyType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Party type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="FARMER">Farmers</SelectItem>
                    <SelectItem value="RETAILER">Retailers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormLabel>Related Sale</FormLabel>
              <Select
                onValueChange={loadSaleItems}
                disabled={!form.watch("partyId") || isLoadingSales}
                value={selectedSaleId || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a sale" />
                </SelectTrigger>
                <SelectContent>
                  {sales?.map((sale) => (
                    <SelectItem key={sale.id} value={String(sale.id)}>
                      {sale.billNumber} - {formatDate(sale?.billDate)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the original sale to return items from
              </FormDescription>
            </div>
          </div>

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Return Reason</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the reason for return..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="updateLedger"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Update Ledger Balance</FormLabel>
                  <FormDescription>
                    Adjust the party's outstanding balance with this return
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Return Items</h3>
              {fields.length === 0 && selectedSaleId && (
                <p className="text-amber-600">Loading items from sale...</p>
              )}
            </div>

            {fields.map((field, index) => {
               const saleItem = selectedSale?.items?.find(
                (i: any) => String(i.id) === String(field.saleItemId)
              );

              // console.log(
              //   "Rendering item:",
              //   field,
              //   "Matching sale item:",
              //   saleItem
              // );

              return (
                <Card key={field.id} className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <Label>Product</Label>
                        <p className="font-medium">
                          {saleItem?.product?.name || "Unknown Product"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {field.productId}
                        </p>
                      </div>

                      <div>
                        <Label>Variant</Label>
                        <p className="font-medium">
                          {saleItem?.variant?.weight || "N/A"}{" "}
                          {saleItem?.variant?.quantityUnitName || ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {field.variantId}
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name={`items.${index}.returnQuantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                max={saleItem?.quantity}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Purchased: {saleItem?.quantity || "N/A"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">
              Total Return Amount: ₹{calculateTotal().toFixed(2)}
            </div>
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || fields.length === 0}>
                {isLoading ? "Processing..." : "Submit Return"}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Return</DialogTitle>
            <DialogDescription>
              Are you sure you want to process this return for ₹
              {calculateTotal().toFixed(2)}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={submitForm} disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm Return"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
