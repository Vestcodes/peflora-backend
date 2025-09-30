import {
	authenticate,
	defineMiddlewares,
	validateAndTransformBody,
	validateAndTransformQuery,
} from "@medusajs/framework/http";
import { GetAdminReviewsSchema } from "./admin/reviews/route";
import { PostAdminUpdateReviewsStatusSchema } from "./admin/reviews/status/route";
import { GetStoreReviewsSchema } from "./store/products/[id]/reviews/route";
import { PostStoreReviewSchema } from "./store/reviews/route";
import { storeSearchRoutesMiddlewares } from './store/search/middlewares';

export default defineMiddlewares({
	routes: [
		{
			method: ["POST"],
			matcher: "/store/reviews",
			middlewares: [
				authenticate("customer", ["session", "bearer"]),
				// @ts-ignore - validateAndTransformBody is not exported from @medusajs/framework/http
				validateAndTransformBody(PostStoreReviewSchema),
			],
		},
		{
			matcher: "/admin/reviews",
			method: ["GET"],
			middlewares: [
				validateAndTransformQuery(GetAdminReviewsSchema, {
					isList: true,
					defaults: [
						"id",
						"title",
						"content",
						"rating",
						"product_id",
						"customer_id",
						"status",
						"created_at",
						"updated_at",
						"product.*",
					],
				}),
			],
		},
		{
			matcher: "/admin/reviews/status",
			method: ["POST"],
			middlewares: [
				// @ts-ignore - validateAndTransformBody is not exported from @medusajs/framework/http
				validateAndTransformBody(PostAdminUpdateReviewsStatusSchema),
			],
		},
		{
			matcher: "/store/products/:id/reviews",
			methods: ["GET"],
			middlewares: [
				validateAndTransformQuery(GetStoreReviewsSchema, {
					isList: true,
					defaults: [
						"id",
						"rating",
						"title",
						"first_name",
						"last_name",
						"content",
						"created_at",
					],
				}),
			],
		},
	],
	...storeSearchRoutesMiddlewares
});
