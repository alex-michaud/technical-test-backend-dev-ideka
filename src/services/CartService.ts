import { Cart, CartItem, AddCartItemRequest, UpdateCartItemRequest } from '../models/CartItem';

/**
 * CartService - Non-persistent in-memory cart service
 * This service manages cart operations without database persistence
 */
export class CartService {
  private carts: Map<string, Cart> = new Map();

  /**
   * Get or create a cart for a user
   */
  getCart(userId: string): Cart {
    if (!this.carts.has(userId)) {
      const newCart: Cart = {
        id: this.generateId(),
        userId,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.carts.set(userId, newCart);
    }
    return this.carts.get(userId)!;
  }

  /**
   * Add an item to the cart
   */
  addItem(userId: string, itemRequest: AddCartItemRequest): Cart {
    const cart = this.getCart(userId);
    
    const newItem: CartItem = {
      id: this.generateId(),
      ...itemRequest,
    };

    cart.items.push(newItem);
    cart.updatedAt = new Date();
    
    return cart;
  }

  /**
   * Update an item in the cart
   */
  updateItem(userId: string, itemId: string, updates: UpdateCartItemRequest): Cart {
    const cart = this.getCart(userId);
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    cart.items[itemIndex] = {
      ...cart.items[itemIndex],
      ...updates,
    };
    cart.updatedAt = new Date();
    
    return cart;
  }

  /**
   * Remove an item from the cart
   */
  removeItem(userId: string, itemId: string): Cart {
    const cart = this.getCart(userId);
    cart.items = cart.items.filter(item => item.id !== itemId);
    cart.updatedAt = new Date();
    
    return cart;
  }

  /**
   * Clear all items from the cart
   */
  clearCart(userId: string): Cart {
    const cart = this.getCart(userId);
    cart.items = [];
    cart.updatedAt = new Date();
    
    return cart;
  }

  /**
   * Get cart total
   */
  getCartTotal(userId: string): number {
    const cart = this.getCart(userId);
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  /**
   * Generate a unique ID (simplified for demo)
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
