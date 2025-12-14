export interface CreateSweetDto {
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
}

export interface UpdateSweetDto {
    name?: string;
    category?: string;
    price?: number;
    quantity?: number;
    description?: string;
}

export interface SearchSweetDto {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
}

export interface PurchaseDto {
    quantity: number;
}

export interface RestockDto {
    quantity: number;
}
