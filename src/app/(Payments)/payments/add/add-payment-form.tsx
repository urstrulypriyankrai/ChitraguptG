"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Party } from "@prisma/client";

const formSchema = z.object({
  partyId: z.string({
    required_error: "Please select a party",
  }),
  amount: z.coerce
    .number({
      required_error: "Please enter an amount",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive"),
  method: z.enum(["CASH", "BANK_TRANSFER", "UPI", "CHEQUE"], {
    required_error: "Please select a payment method",
  }),
  paymentDate: z.date({
    required_error: "Please select a date",
  }),
  reference: z.string().optional(),
  description: z.string().optional(),
  referenceType: z.string().optional(),
  referenceId: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddPaymentFormProps {
  initialPartyId?: string;
  initialPartyType?: string;
  initialReferenceType?: string;
  initialReferenceId?: number;
}

export default function AddPaymentForm({
  initialPartyId,
  initialPartyType,
  initialReferenceType,
  initialReferenceId,
}: AddPaymentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [parties, setParties] = useState<Party[]>([]);
  const [partyType, setPartyType] = useState<string>(initialPartyType || "all");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partyId: initialPartyId || "",
      amount: 0, // Initialize with 0 instead of undefined
      method: "CASH", // Default payment method
      paymentDate: new Date(),
      reference: "",
      description: "",
      referenceType: initialReferenceType || undefined,
      referenceId: initialReferenceId || undefined,
    },
  });

  useEffect(() => {
    async function fetchParties() {
      try {
        let url = "/api/party";
        if (partyType !== "all") {
          url += `?partyType=${partyType}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch parties");
        }

        const data = await response.json();
        setParties(data.party || []);
      } catch (error) {
        console.error("Error fetching parties:", error);
        toast({
          title: "Error",
          description: "Failed to load parties. Please try again.",
          variant: "destructive",
        });
      }
    }

    fetchParties();
  }, [partyType]);

  // Set initial party ID if provided
  useEffect(() => {
    if (initialPartyId) {
      form.setValue("partyId", initialPartyId);
    }
  }, [initialPartyId, form]);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partyId: values.partyId,
          amount: values.amount,
          method: values.method,
          date: values.paymentDate.toISOString(),
          reference:
            values.reference ||
            `Payment on ${format(values.paymentDate, "dd/MM/yyyy")}`,
          description: values.description,
          referenceType: values.referenceType,
          referenceId: values.referenceId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create payment");
      }

      toast({
        title: "Payment recorded successfully",
        description: `Payment of ₹${values.amount.toFixed(
          2
        )} has been recorded.`,
      });

      // Redirect to payments list
      router.push("/payments");
      router.refresh();
    } catch (error) {
      console.error("Error creating payment:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to record payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
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
                      Select the party making the payment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-40">
              <FormLabel>Filter By Type</FormLabel>
              <Select
                disabled={isLoading || !!initialPartyType}
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

          <div className="flex gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter amount"
                        value={field.value === 0 ? "" : field.value}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? 0
                              : Number.parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormDescription>Enter the payment amount</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="BANK_TRANSFER">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="CHEQUE">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the payment method</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Payment Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The date when the payment was made
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Payment reference (optional)"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter a reference number or description for this payment
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional notes about this payment (optional)"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Recording..." : "Record Payment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
