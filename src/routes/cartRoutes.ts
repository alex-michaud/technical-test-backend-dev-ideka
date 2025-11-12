import { Router, Request, Response } from "express";
import { CartService } from "../services/CartService";
import { AddCartItemRequest, UpdateCartItemRequest } from "../models/CartItem";

const router = Router();
const cartService = new CartService();

/**
 * GET /api/cart/:userId
 * Get the cart for a specific user
 */
router.get("/:userId", (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const cart = cartService.getCart(userId);
		res.json(cart);
	} catch (error) {
		res.status(500).json({ error: "Failed to retrieve cart" });
	}
});

/**
 * POST /api/cart/:userId/items
 * Add an item to the cart
 */
router.post("/:userId/items", (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const itemRequest: AddCartItemRequest = req.body;

		// Basic validation
		if (
			!itemRequest.productId ||
			!itemRequest.productName ||
			itemRequest.quantity === undefined ||
			itemRequest.price === undefined
		) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		const cart = cartService.addItem(userId, itemRequest);
		res.status(201).json(cart);
	} catch (error) {
		res.status(500).json({ error: "Failed to add item to cart" });
	}
});

/**
 * PUT /api/cart/:userId/items/:itemId
 * Update an item in the cart
 */
router.put("/:userId/items/:itemId", (req: Request, res: Response) => {
	try {
		const { userId, itemId } = req.params;
		const updates: UpdateCartItemRequest = req.body;

		const cart = cartService.updateItem(userId, itemId, updates);
		res.json(cart);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to update item";
		res.status(404).json({ error: message });
	}
});

/**
 * DELETE /api/cart/:userId/items/:itemId
 * Remove an item from the cart
 */
router.delete("/:userId/items/:itemId", (req: Request, res: Response) => {
	try {
		const { userId, itemId } = req.params;
		const cart = cartService.removeItem(userId, itemId);
		res.json(cart);
	} catch (error) {
		res.status(500).json({ error: "Failed to remove item from cart" });
	}
});

/**
 * DELETE /api/cart/:userId
 * Clear the entire cart
 */
router.delete("/:userId", (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const cart = cartService.clearCart(userId);
		res.json(cart);
	} catch (error) {
		res.status(500).json({ error: "Failed to clear cart" });
	}
});

/**
 * GET /api/cart/:userId/total
 * Get the total price of items in the cart
 */
router.get("/:userId/total", (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const total = cartService.getCartTotal(userId);
		res.json({ userId, total });
	} catch (error) {
		res.status(500).json({ error: "Failed to calculate cart total" });
	}
});

export default router;
