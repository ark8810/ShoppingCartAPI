
interface CartItem {
    itemId: number;
    itemName: string;
    price: number;
    description: string;
    quantity: number;
  }
  
  interface CartDetails {
    cartId: number;
    active: boolean;
    userId: number;
    subtotal: number;
    discounts: number;
    taxes: number;
    total: number;
    items: CartItem[];
  }