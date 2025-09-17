/**
 * @oas [get] /admin/reviews
 * operationId: GetAdminReviews
 * summary: Retrieve a list of reviews (Admin)
 * description: Retrieve a paginated list of reviews with optional filtering, ordering, and field selection.
 * x-authenticated: true
 * tags:
 *   - Admin Reviews
 * parameters:
 *   - in: query
 *     name: offset
 *     schema:
 *       type: integer
 *       default: 0
 *     description: Number of items to skip
 *   - in: query
 *     name: limit
 *     schema:
 *       type: integer
 *       default: 20
 *     description: Maximum number of items to return
 *   - in: query
 *     name: order
 *     schema:
 *       type: string
 *       enum: [asc, desc]
 *     description: Order of results
 *   - in: query
 *     name: fields
 *     schema:
 *       type: string
 *     description: Comma-separated list of fields to include
 *   - in: query
 *     name: expand
 *     schema:
 *       type: string
 *     description: Comma-separated list of relations to expand
 * responses:
 *   "200":
 *     description: A paginated list of reviews
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

export const GetAdminReviewsSchema = createFindParams();

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
	const query = req.scope.resolve("query");

	const {
		data: reviews,
		metadata: { count, take, skip } = {
			count: 0,
			take: 20,
			skip: 0,
		},
	} = await query.graph({
		entity: "review",
		...req.queryConfig,
	});

	res.json({
		reviews,
		count,
		limit: take,
		offset: skip,
	});
};
