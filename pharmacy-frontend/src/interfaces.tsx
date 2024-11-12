import { StringLiteral } from "typescript";

export interface InventoryItem {
    id: string;
    name: string;
    amount: number;
    supplier: string;
    price_per_quantity: number;
    expiration_date: string;
}

export interface FiscalItem {
    itemId: string;
    itemName: string;
    quantityPurchased: number;
    supplier: string;
    pricePerUnit: number;
}

export interface PharmacyDetails{
    name: string;
    website: string;
    address: string;
    owner: string;
    phoneNumber: string;
    openingTime: string;
    closingTime: string;
}
export interface User {
    id: string;
    type: string;
    name: string;
    username: string;
    password: string;
    disabled: boolean;
    locked: boolean;
    attempted: number;
  }

export interface Patient {
    id: number;
    name: string;
    dateOfBirth: string;
    address: string;
    phone: string;
    email: string;
    insurance: string;
    prescriptions: Prescription[];
  }

export interface Prescription{
    name: string;
    amount: number;
}