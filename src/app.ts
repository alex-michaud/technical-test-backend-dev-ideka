import express, { Express, Request, Response } from "express";
import cartRoutes from "./routes/cartRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
	res.json({
		message: "Telecom Cart Experience API",
		version: "1.0.0",
		endpoints: {
			cart: "/api/cart/:userId",
			addItem: "POST /api/cart/:userId/items",
			updateItem: "PUT /api/cart/:userId/items/:itemId",
			removeItem: "DELETE /api/cart/:userId/items/:itemId",
			clearCart: "DELETE /api/cart/:userId",
			getTotal: "GET /api/cart/:userId/total",
		},
	});
});

app.use("/api/cart", cartRoutes);

// Error handling
app.use(errorHandler);

export default app;
