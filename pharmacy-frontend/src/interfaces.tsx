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