import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentRequest:
 *       type: object
 *       required:
 *         - amount
 *         - cardNumber
 *         - expiryDate
 *         - cvv
 *         - accountId
 *         - accountType
 *       properties:
 *         amount:
 *           type: string
 *           description: Payment amount with up to 2 decimal places
 *           example: "50.00"
 *         cardNumber:
 *           type: string
 *           description: Credit card number
 *           example: "4242424242424242"
 *         expiryDate:
 *           type: string
 *           description: Card expiry date in MM/YY format
 *           example: "12/25"
 *         cvv:
 *           type: string
 *           description: Card verification value (3-4 digits)
 *           example: "123"
 *         accountId:
 *           type: string
 *           description: The utility account ID
 *           example: "A-0001"
 *         accountType:
 *           type: string
 *           enum: [ELECTRICITY, GAS]
 *           description: The type of utility account
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the payment was successful
 *         message:
 *           type: string
 *           description: Response message
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Always false for errors
 *         message:
 *           type: string
 *           description: Error message
 *         errors:
 *           type: array
 *           description: Validation errors if any
 *           items:
 *             type: object
 */

// Payment validation schema
const paymentRequestSchema = z.object({
  amount: z.string(),
  cardNumber: z.string(),
  expiryDate: z.string(),
  cvv: z.string(),
  accountId: z.string(),
  accountType: z.enum(["ELECTRICITY", "GAS"]),
});

/**
 * @swagger
 * /api/processPayment:
 *   post:
 *     summary: Process a utility bill payment
 *     description: Processes a payment for a utility account using credit card details
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Invalid payment data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(request: Request) {
  try {
    console.log("Processing payment...");
    const body = await request.json();

    // Validate the request body
    const validatedData = paymentRequestSchema.parse(body);

    console.log("Payment data validated:", {
      ...validatedData,
      cardNumber: "****" + validatedData.cardNumber.slice(-4),
      cvv: "***",
    });

    // For now, just return success
    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.error("Payment processing error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment data",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Payment processing failed" },
      { status: 500 }
    );
  }
}
