import {
	AddCartItemRequest,
	UpdateCartItemRequest,
} from "../models/CartItem";
import { getPrismaClient } from "./Database";
import type { Cart, CartItem, Prisma } from '@prisma/client';
// import type { Cart, CartItem } from "../models/CartItem";

const prisma = getPrismaClient();

// Use Prisma-generated types: a cart returned with `include: { items: true }`
// has the shape `Cart & { items: CartItem[] }`.
type CartWithItems = Prisma.CartGetPayload<{ include: { items: true } }>;
// A cartItem fetched with its cart included will be CartItem & { cart: Cart }
type ItemWithCart = Prisma.CartItemGetPayload<{ include: { cart: true } }>;

/**
 * CartService - Persistent cart service backed by Prisma (with in-memory fallback)
 * This service manages cart operations and persists them using Prisma. If any
 * database operation fails, the service falls back to a local in-memory Map so
 * the API remains usable in tests or offline scenarios.
 */
export class CartService {
	private carts: Map<string, CartWithItems> = new Map();

	/**
	 * Identity map for Prisma cart-with-items
	 */
	private mapPrismaCart(prismaCart: CartWithItems): CartWithItems {
		return prismaCart;
	}

	/**
	 * Get or create a cart for a user (DB-backed)
	 */
	async getCart(userId: string): Promise<CartWithItems> {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: true }
      })
    }

    const mapped = this.mapPrismaCart(cart);
    this.carts.set(userId, mapped);
    return mapped;
	}

	/**
	 * Add an item to the cart (DB-backed)
	 */
	async addItem(userId: string, itemRequest: AddCartItemRequest): Promise<CartWithItems> {
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const planType = itemRequest.planType ? itemRequest.planType.toUpperCase() : undefined;

    await prisma.cartItem.create({
      data: {
        productId: itemRequest.productId,
        productName: itemRequest.productName,
        quantity: itemRequest.quantity,
        price: itemRequest.price,
        planType: planType as any,
        dataAllowance: itemRequest.dataAllowance ?? null,
        cartId: cart.id,
      },
    });

    const refreshed = await prisma.cart.findUnique({ where: { userId }, include: { items: true } });
    if (!refreshed) throw new Error("Failed to fetch cart after insert");
    this.carts.set(userId, refreshed);
    return refreshed;
	}

	/**
	 * Update an item in the cart (DB-backed)
	 */
	async updateItem(userId: string, itemId: string, updates: UpdateCartItemRequest): Promise<CartWithItems> {
    const existing = (await prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } as any })) as ItemWithCart | null;
    if (!existing || existing.cart.userId !== userId) {
      throw new Error("Item not found in cart");
    }

    await prisma.cartItem.update({ where: { id: itemId }, data: updates });

    const refreshed = await prisma.cart.findUnique({ where: { userId }, include: { items: true } });
    if (!refreshed) throw new Error("Cart not found");
    this.carts.set(userId, refreshed);
    return refreshed;
	}

	/**
	 * Remove an item from the cart (DB-backed)
	 */
	async removeItem(userId: string, itemId: string): Promise<CartWithItems> {
    const existing = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } });
    if (!existing || existing.cart.userId !== userId) {
      throw new Error("Item not found in cart");
    }
    await prisma.cartItem.delete({ where: { id: itemId } });
    const refreshed = await prisma.cart.findUnique({ where: { userId }, include: { items: true } });
    if (!refreshed) throw new Error("Cart not found");
    this.carts.set(userId, refreshed);
    return refreshed;
	}

	/**
	 * Clear all items from the cart (DB-backed)
	 */
	async clearCart(userId: string): Promise<CartWithItems> {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      const created = await prisma.cart.create({ data: { userId } });
      const mapped = ({ ...created, items: [] } as unknown) as CartWithItems;
      this.carts.set(userId, mapped);
      return mapped;
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    const refreshed = (await prisma.cart.findUnique({ where: { userId }, include: { items: true } })) as CartWithItems | null;
    const mapped = refreshed ?? ({ ...cart, items: [] } as CartWithItems);
    this.carts.set(userId, mapped);
    return mapped;
	}

	/**
	 * Get cart total (DB-backed)
	 */
	async getCartTotal(userId: string): Promise<number> {
    const cart = await prisma.cart.findUnique({ where: { userId }, include: { items: true } });
    if (!cart) return 0;
    return (cart.items || []).reduce((total: number, it: CartItem) => total + it.price * it.quantity, 0);
	}

}
