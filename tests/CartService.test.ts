import { expect } from "chai";
import { describe } from "mocha";
import { CartService } from "../src/services/CartService";
import { AddCartItemRequest } from "../src/models/CartItem";

describe("CartService", () => {
	let cartService: CartService;

	beforeEach(() => {
		cartService = new CartService();
	});

	describe("getCart", () => {
		it("should create a new cart for a user", async () => {
			const userId = "user123";
			const cart = await cartService.getCart(userId);

			expect(cart).to.exist;
			expect(cart.userId).to.equal(userId);
			expect(cart.items).to.be.an("array").that.is.empty;
		});

		it("should return the same cart for the same user", async () => {
			const userId = "user123";
			const cart1 = await cartService.getCart(userId);
			const cart2 = await cartService.getCart(userId);

			expect(cart1.id).to.equal(cart2.id);
		});
	});

	describe("addItem", () => {
		it("should add an item to the cart", async () => {
			const userId = "user123";
			const itemRequest: AddCartItemRequest = {
				productId: "prod-001",
				productName: "Premium Data Plan",
				quantity: 1,
				price: 49.99,
				planType: "postpaid",
				dataAllowance: "50GB",
			};

			const cart = await cartService.addItem(userId, itemRequest);

			expect(cart.items).to.have.lengthOf(1);
			expect(cart.items[0].productId).to.equal(itemRequest.productId);
			expect(cart.items[0].productName).to.equal(itemRequest.productName);
			expect(cart.items[0].quantity).to.equal(itemRequest.quantity);
			expect(cart.items[0].price).to.equal(itemRequest.price);
		});

		it("should add multiple items to the cart", async () => {
			const userId = "user123";

			await cartService.addItem(userId, {
				productId: "prod-001",
				productName: "Premium Plan",
				quantity: 1,
				price: 49.99,
			});

			await cartService.addItem(userId, {
				productId: "prod-002",
				productName: "Basic Plan",
				quantity: 2,
				price: 19.99,
			});

			const cart = await cartService.getCart(userId);
			expect(cart.items).to.have.lengthOf(2);
		});
	});

	describe("updateItem", () => {
		it("should update an item quantity", async () => {
			const userId = "user123";
			const itemRequest: AddCartItemRequest = {
				productId: "prod-001",
				productName: "Premium Plan",
				quantity: 1,
				price: 49.99,
			};

			const cart = await cartService.addItem(userId, itemRequest);
			const itemId = cart.items[0].id;

			const updatedCart = await cartService.updateItem(userId, itemId, {
				quantity: 3,
			});

			expect(updatedCart.items[0].quantity).to.equal(3);
		});

		it("should throw error when updating non-existent item", async () => {
			const userId = "user123";
			try {
				await cartService.updateItem(userId, "non-existent-id", { quantity: 2 });
				throw new Error("Expected updateItem to throw");
			} catch (err: any) {
				expect(err.message).to.equal("Item not found in cart");
			}
		});
	});

	describe("removeItem", () => {
		it("should remove an item from the cart", async () => {
			const userId = "user123";
			const itemRequest: AddCartItemRequest = {
				productId: "prod-001",
				productName: "Premium Plan",
				quantity: 1,
				price: 49.99,
			};

			const cart = await cartService.addItem(userId, itemRequest);
			const itemId = cart.items[0].id;

			const updatedCart = await cartService.removeItem(userId, itemId);

			expect(updatedCart.items).to.have.lengthOf(0);
		});

		it("should only remove the specified item", async () => {
			const userId = "user123";

			await cartService.addItem(userId, {
				productId: "prod-001",
				productName: "Premium Plan",
				quantity: 1,
				price: 49.99,
			});

			const cart = await cartService.addItem(userId, {
				productId: "prod-002",
				productName: "Basic Plan",
				quantity: 2,
				price: 19.99,
			});

			const firstItemId = cart.items[0].id;
			const updatedCart = await cartService.removeItem(userId, firstItemId);

			expect(updatedCart.items).to.have.lengthOf(1);
			expect(updatedCart.items[0].productId).to.equal("prod-002");
		});
	});

	describe("clearCart", () => {
		it("should remove all items from the cart", async () => {
			const userId = "user123";

			await cartService.addItem(userId, {
				productId: "prod-001",
				productName: "Premium Plan",
				quantity: 1,
				price: 49.99,
			});

			await cartService.addItem(userId, {
				productId: "prod-002",
				productName: "Basic Plan",
				quantity: 2,
				price: 19.99,
			});

			const clearedCart = await cartService.clearCart(userId);

			expect(clearedCart.items).to.have.lengthOf(0);
		});
	});

	describe("getCartTotal", () => {
		it("should calculate the correct total for empty cart", async () => {
			const userId = "user123";
			const total = await cartService.getCartTotal(userId);

			expect(total).to.equal(0);
		});

		it("should calculate the correct total for single item", async () => {
			const userId = "user123";

			await cartService.addItem(userId, {
				productId: "prod-001",
				productName: "Premium Plan",
				quantity: 2,
				price: 49.99,
			});

			const total = await cartService.getCartTotal(userId);

			expect(total).to.equal(99.98);
		});

		it("should calculate the correct total for multiple items", async () => {
			const userId = "user123";

			await cartService.addItem(userId, {
				productId: "prod-001",
				productName: "Premium Plan",
				quantity: 1,
				price: 49.99,
			});

			await cartService.addItem(userId, {
				productId: "prod-002",
				productName: "Basic Plan",
				quantity: 2,
				price: 19.99,
			});

			const total = await cartService.getCartTotal(userId);

			expect(total).to.equal(89.97);
		});
	});
});
