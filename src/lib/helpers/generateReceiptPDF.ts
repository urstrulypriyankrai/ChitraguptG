import { jsPDF } from "jspdf"
import "jspdf-autotable"

interface ReceiptData {
  paymentId: number
  paymentDate: string
  amount: number
  reference?: string
  party: {
    name: string
    partyType: string
    mobile: string
    address?: {
      street?: string
      village?: string
      district: string
      state: string
      zip: string
    }
  }
}

export async function generateReceiptPDF(receiptData: ReceiptData, action: "print" | "download"): Promise<void> {
  // Create a new PDF document
  const doc = new jsPDF()

  // Set font
  doc.setFont("helvetica")

  // Add company header
  doc.setFontSize(20)
  doc.setTextColor(0, 0, 0)
  doc.text("ChitraguptG", 105, 20, { align: "center" })

  doc.setFontSize(12)
  doc.text("Your Reliable Billing and Stock Manager", 105, 28, { align: "center" })

  doc.setFontSize(10)
  doc.text("123 Agriculture Street, Seoni, Madhya Pradesh - 480991", 105, 35, { align: "center" })
  doc.text("Phone: +91 9876543210 | Email: info@chitraguptg.com", 105, 40, { align: "center" })

  // Add horizontal line
  doc.setDrawColor(0)
  doc.setLineWidth(0.5)
  doc.line(15, 45, 195, 45)

  // Receipt details
  doc.setFontSize(14)
  doc.text("PAYMENT RECEIPT", 15, 55)

  doc.setFontSize(10)
  doc.text(`Receipt Number: PAY-${receiptData.paymentId}`, 15, 62)
  doc.text(`Date: ${new Date(receiptData.paymentDate).toLocaleDateString("en-IN")}`, 15, 68)

  // Party details
  doc.setFontSize(12)
  doc.text(`Party Details:`, 130, 55)

  doc.setFontSize(10)
  doc.text(`Name: ${receiptData.party.name || "N/A"}`, 130, 62)
  doc.text(`Type: ${receiptData.party.partyType || "N/A"}`, 130, 68)
  doc.text(`Mobile: ${receiptData.party.mobile || "N/A"}`, 130, 74)

  // Address
  const address = receiptData.party.address
  let addressText = ""

  if (address) {
    const addressParts = [address.village, address.street, address.district, address.state, address.zip].filter(Boolean)
    addressText = addressParts.join(", ")
  } else {
    addressText = "Address not available"
  }

  // Wrap address text if it's too long
  const addressLines = doc.splitTextToSize(addressText, 65)
  doc.text(addressLines, 130, 80)

  // Payment details
  doc.setFontSize(12)
  doc.text("Payment Details:", 15, 95)

  // @ts-ignore - jspdf-autotable types
  doc.autoTable({
    startY: 100,
    head: [["Description", "Amount"]],
    body: [
      ["Payment", `₹${Number(receiptData.amount).toFixed(2)}`],
      ["Reference", receiptData.reference || "N/A"],
    ],
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [80, 80, 80] },
    margin: { top: 10, right: 15, bottom: 10, left: 15 },
  })

  // Get the final Y position after the table
  // @ts-ignore - jspdf-autotable types
  const finalY = (doc as any).lastAutoTable.finalY || 150

  // Summary section
  doc.setFontSize(12)
  doc.text("Payment Summary:", 15, finalY + 15)

  doc.setFontSize(10)
  doc.text(`Total Amount Paid: ₹${Number(receiptData.amount).toFixed(2)}`, 15, finalY + 25)
  doc.text(`Payment Method: Cash/Bank Transfer`, 15, finalY + 35)
  doc.text(`Payment Status: Completed`, 15, finalY + 45)

  // Signature
  doc.text("For ChitraguptG", 150, finalY + 35)
  doc.text("Authorized Signatory", 150, finalY + 50)

  // Footer
  doc.setFontSize(8)
  doc.text("This is a computer-generated receipt and does not require a signature.", 105, 270, { align: "center" })
  doc.text("Thank you for your business!", 105, 275, { align: "center" })

  // Handle the action based on the parameter
  if (action === "print") {
    doc.autoPrint()
    window.open(URL.createObjectURL(doc.output("blob")))
  } else if (action === "download") {
    doc.save(`Receipt-PAY-${receiptData.paymentId}.pdf`)
  }
}

