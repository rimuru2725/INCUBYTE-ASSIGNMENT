export interface Sweet {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSweetData {
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
}

export interface UpdateSweetData {
    name?: string;
    category?: string;
    price?: number;
    quantity?: number;
    description?: string;
}

export interface SearchParams {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
}
