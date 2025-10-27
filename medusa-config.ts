import { ContainerRegistrationKeys, defineConfig, Modules } from "@medusajs/framework/utils";
import dotenv from "dotenv"

if (process.env.NODE_ENV === "production") {
	dotenv.config({ path: ".env.production" });
} else if (process.env.NODE_ENV === "development") {
	dotenv.config({ path: ".env.development" });
} else {
	console.log("No environment variables found");
	dotenv.config();
}

module.exports = defineConfig({
	projectConfig: {
		databaseUrl: process.env.DATABASE_URL!,
		databaseDriverOptions: {
			connection: {
				ssl: {
					rejectUnauthorized: false,
				}
			}
		},
		http: {
			storeCors: process.env.STORE_CORS ?? "http://localhost:5173,http://localhost:9000,https://docs.medusajs.com,http://localhost:3000,https://peflora.com,https://admin.peflora.com",
			adminCors: process.env.ADMIN_CORS ?? "http://localhost:5173,http://localhost:9000,https://docs.medusajs.com,http://localhost:3000,https://peflora.com,https://admin.peflora.com",
			authCors: process.env.AUTH_CORS ?? "http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com,http://localhost:3000,https://peflora.com,https://admin.peflora.com",
			jwtSecret: process.env.JWT_SECRET!,
			cookieSecret: process.env.COOKIE_SECRET!,
		},
		redisUrl: `rediss://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
		redisOptions: {
			enableAutoPipelining: true,
			enableOfflineQueue: true,
			tls: {
				rejectUnauthorized: false,
			},
			username: process.env.REDIS_USERNAME,
			password: process.env.REDIS_PASSWORD,
			host: process.env.REDIS_HOST,
			port: Number.parseInt(process.env.REDIS_PORT || "23510", 10),
			keepAlive: 1,
			retryStrategy: (times: number) => {
				return Math.min(times * 50, 2000);
			}
		},
		workerMode: "shared",
	},
	admin: {
		disable: true,
		backendUrl: "https://admin.peflora.com",
		path: '/'
	},
	modules: [
		{
			resolve: "@medusajs/medusa/notification",
			dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
			options: {
				providers: [
					{
						resolve: "@medusajs/medusa/notification-local",
						id: "local",
						options: {
							name: "Local Notification Provider",
							channels: ["feed"],
						},
					},
					{
						resolve: "@perseidesjs/notification-nodemailer/providers/nodemailer",
						id: "nodemailer",
						options: {
							from: process.env.NOTIFICATION_PROVIDER_FROM,
							channels: ["email"],
							host: process.env.SMTP_HOST,
							port: process.env.SMTP_PORT,
							secure: false,
							auth: {
								user: process.env.SMTP_USER,
								pass: process.env.SMTP_PASS
							}
						},
					},
				],
			},
		},
		{
			resolve: "@medusajs/medusa/file",
			dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
			options: {
				providers: [
					{
						resolve: "@medusajs/medusa/file-s3",
						id: "s3",
						options: {
							file_url: process.env.S3_FILE_URL,
							access_key_id: process.env.S3_ACCESS_KEY_ID,
							secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
							region: process.env.S3_REGION,
							bucket: process.env.S3_BUCKET,
							endpoint: process.env.S3_ENDPOINT,
							prefix: process.env.S3_PREFIX,
							additional_client_config: {
								forcePathStyle: true,
							},
						},
					},
				],
			},
		},
		{
			resolve: "./src/modules/product-review",
			dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
			options: {},
		},
		{
			resolve: "./src/modules/banner",
			dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
			options: {},
		},
		{
			resolve: "@medusajs/medusa/payment",
			dependencies: [
				Modules.CACHE,
				ContainerRegistrationKeys.LOGGER,
				Modules.CUSTOMER,
				Modules.ORDER,
				Modules.PAYMENT,
				Modules.CART,
				ContainerRegistrationKeys.MANAGER,
				Modules.LINK,
				ContainerRegistrationKeys.LINK,
				ContainerRegistrationKeys.QUERY,
				ContainerRegistrationKeys.PG_CONNECTION
			],
			options: {
				providers: [
					{
						resolve: "@tsc_tech/medusa-plugin-razorpay-payment/providers/razorpay",
						id: "razorpay",
						options: {
							key_id: process?.env?.RAZORPAY_ID,
							key_secret: process?.env?.RAZORPAY_SECRET,
							webhook_secret: process?.env?.RAZORPAY_WEBHOOK_SECRET,
							razorpay_account: process?.env?.RAZORPAY_ACCOUNT,
							manual_expiry_period: 24,
							automatic_expiry_period: 24,
						}
					}
				]
			}
		},
		{
			resolve: "@medusajs/medusa/auth",
			dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
			options: {
				providers: [
					{
						resolve: "@medusajs/medusa/auth-emailpass",
						id: "emailpass",
					},
				],
			},
		},
		{
			resolve: "@medusajs/medusa/workflow-engine-redis",
			options: { redis: { url: process.env.REDIS_URL } },
		},
		{
			resolve: "@medusajs/medusa/locking",
			options: {
				providers: [
					{
						resolve: "@medusajs/medusa/locking-redis",
						id: "locking-redis",
						is_default: true,
						options: { redisUrl: process.env.LOCKING_REDIS_URL || process.env.REDIS_URL },
					},
				],
			},
		},
	],
	plugins: [
		{
			resolve: "@rsc-labs/medusa-store-analytics-v2",
			options: {}
		},
		{
			resolve: "@rsc-labs/medusa-wishlist",
			options: {}
		},
		{
			resolve: "@rsc-labs/medusa-products-bought-together-v2",
			options: {}
		}
	]
});
