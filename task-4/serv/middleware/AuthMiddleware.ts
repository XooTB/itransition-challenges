import type { Request, Response, NextFunction } from "express";
import type { Pool } from "pg";
import jwt from "jsonwebtoken";

interface DecodedToken {
	userId: number;
}

declare global {
	namespace Express {
		interface Request {
			userId?: number;
		}
	}
}

class AuthMiddleware {
	private pool: Pool;

	constructor(pool: Pool) {
		this.pool = pool;
	}

	authenticate = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const authHeader = req.headers.authorization;
		const secretToken = process.env.JWT_SECRET || "supersecret";

		if (!authHeader) {
			res.status(401).json({ error: "No token provided" });
			return;
		}

		const token = authHeader.split(" ")[1];

		try {
			const decoded = jwt.verify(token, secretToken) as DecodedToken;
			req.userId = decoded.userId;

			// Check if the user's account is blocked or deleted
			const userStatus = await this.checkUserStatus(req.userId);

			if (userStatus === "blocked") {
				res.status(403).json({ error: "Account is blocked" });
				return;
			}

			if (userStatus === "deleted") {
				res.status(404).json({ error: "Account not found" });
				return;
			}

			next();
		} catch (error) {
			res.status(401).json({ error: "Invalid token" });
		}
	};

	private async checkUserStatus(userId: number): Promise<string> {
		const query = "SELECT status FROM users WHERE id = $1";
		const values = [userId];

		try {
			const result = await this.pool.query(query, values);
			if (result.rows.length > 0) {
				return result.rows[0].status;
			}
			return "deleted"; // Assume deleted if user not found
		} catch (error) {
			console.error("Error checking user status:", error);
			throw error;
		}
	}
}

export default AuthMiddleware;
