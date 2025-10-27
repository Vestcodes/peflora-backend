/**
 * @oas [get] /admin/banners
 * operationId: GetAdminBanners
 * summary: Retrieve banners (Admin)
 * description: Retrieve a paginated list of banners with optional filtering by type.
 * x-authenticated: true
 * tags:
 *   - Admin Banners
 * parameters:
 *   - in: query
 *     name: type
 *     schema:
 *       type: string
 *       enum: [mobile, desktop]
 *     description: Filter by banner type
 *   - in: query
 *     name: is_active
 *     schema:
 *       type: boolean
 *     description: Filter by active status
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
 * responses:
 *   "200":
 *     description: A paginated list of banners
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

export const GetAdminBannersSchema = createFindParams();

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
	const query = req.scope.resolve("query");

	try {
		const {
			data: banners,
			metadata: { count, take, skip } = {
				count: 0,
				take: 20,
				skip: 0,
			},
		} = await query.graph({
			entity: "banner",
			...req.queryConfig,
		});

		res.json({
			banners,
			count,
			limit: take,
			offset: skip,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to retrieve banners",
			error: error.message,
		});
	}
};
