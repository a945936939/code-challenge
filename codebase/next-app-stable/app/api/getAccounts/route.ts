import { NextResponse } from "next/server";

/**
 * @swagger
 * components:
 *   schemas:
 *     EnergyAccount:
 *       type: object
 *       required:
 *         - id
 *         - type
 *         - balance
 *         - address
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the account
 *           example: A-0001
 *         type:
 *           type: string
 *           enum: [ELECTRICITY, GAS]
 *           description: The type of utility account
 *         balance:
 *           type: number
 *           description: The current balance of the account
 *           example: 30
 *         address:
 *           type: string
 *           description: The service address for the account
 *           example: 1 Greville Ct, Thomastown, 3076, Victoria
 */
type EnergyAccount = {
  id: string;
  type: "ELECTRICITY" | "GAS";
  balance: number;
  address: string;
};

const accounts: EnergyAccount[] = [
  {
    id: "A-0001",
    type: "ELECTRICITY",
    balance: 30,
    address: "1 Greville Ct, Thomastown, 3076, Victoria",
  },
  {
    id: "A-0002",
    type: "GAS",
    balance: 0,
    address: "74 Taltarni Rd, Yawong Hills, 3478, Victoria",
  },
  {
    id: "A-0003",
    type: "ELECTRICITY",
    balance: -40,
    address: "44 William Road, Cresswell Downs, 0862, Northern Territory",
  },
  {
    id: "A-0004",
    type: "ELECTRICITY",
    balance: 50,
    address: "87 Carolina Park Road, Forresters Beach, 2260, New South Wales",
  },
  {
    id: "A-0005",
    type: "GAS",
    balance: 25,
    address: "12 Sunset Blvd, Redcliffe, 4020, Queensland",
  },
  {
    id: "A-0006",
    type: "ELECTRICITY",
    balance: -15,
    address: "3 Ocean View Dr, Torquay, 3228, Victoria",
  },
  {
    id: "A-0007",
    type: "GAS",
    balance: 0,
    address: "150 Greenway Cres, Mawson Lakes, 5095, South Australia",
  },
  {
    id: "A-0008",
    type: "ELECTRICITY",
    balance: 120,
    address: "88 Harbour St, Sydney, 2000, New South Wales",
  },
  {
    id: "A-0009",
    type: "GAS",
    balance: -60,
    address: "22 Boulder Rd, Kalgoorlie, 6430, Western Australia",
  },
];

/**
 * @swagger
 * /api/getAccounts:
 *   get:
 *     summary: Retrieves all utility accounts
 *     description: Returns a list of all electricity and gas accounts with their details
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: A list of utility accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EnergyAccount'
 *       500:
 *         description: Server error
 */
export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json(accounts);
}
