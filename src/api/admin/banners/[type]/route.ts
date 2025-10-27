/**
 * @oas [get] /admin/banners/{type}
 * operationId: GetAdminBannersByType
 * summary: Retrieve banners by type (Admin)
 * description: Retrieve banners for a specific type (mobile or desktop) with a maximum of 5 banners.
 * x-authenticated: true
 * tags:
 *   - Admin Banners
 * parameters:
 *   - in: path
 *     name: type
 *     schema:
 *       type: string
 *       enum: [mobile, desktop]
 *     required: true
 *     description: Banner type
 *   - in: query
 *     name: is_active
 *     schema:
 *       type: boolean
 *       default: true
 *     description: Filter by active status
 * responses:
 *   "200":
 *     description: List of banners for the specified type
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     description: Banner type not found
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

type PathParams = {
	type: "mobile" | "desktop";
};

export const GET = async (
	req: MedusaRequest & { params: PathParams },
	res: MedusaResponse
) => {
	const bannerService = req.scope.resolve("banner") as {
		getActiveBannersByType: (type: string) => Promise<any[]>;
		getAllBannersByType: (type: string) => Promise<any[]>;
	};

	try {
		const { type } = req.params;
		const is_active = req.query.is_active !== undefined ? req.query.is_active === "true" : true;

		let banners;

		if (is_active) {
			banners = await bannerService.getActiveBannersByType(type);
		} else {
			banners = await bannerService.getAllBannersByType(type);
		}

		// Ensure we don't return more than 5 banners
		const limitedBanners = banners.slice(0, 5);

		res.json({
			banners: limitedBanners,
			type,
			count: limitedBanners.length,
			max_allowed: 5,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to retrieve banners",
			error: error.message,
		});
	}
};
