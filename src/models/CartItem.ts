export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  planType?: 'prepaid' | 'postpaid';
  dataAllowance?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AddCartItemRequest {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  planType?: 'prepaid' | 'postpaid';
  dataAllowance?: string;
}

export interface UpdateCartItemRequest {
  quantity?: number;
  price?: number;
}
