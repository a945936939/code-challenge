import { z } from "zod";
import Payment from "payment";

export const paymentSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Amount must be a number with up to 2 decimal places"
    )
    .refine((val) => parseFloat(val) > 0, "Amount must be greater than 0"),
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .refine(
      (val) => Payment.fns.validateCardNumber(val),
      "Please enter a valid card number"
    ),
  expiryDate: z
    .string()
    .min(1, "Expiry date is required")
    .regex(/^\d{2}\/\d{2}$/, "Use MM/YY format")
    .refine((val) => {
      const [month, year] = val.split("/");
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      return expiry > new Date() && parseInt(month) <= 12;
    }, "Invalid expiry date"),
  cvv: z
    .string()
    .min(1, "CVV is required")
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
