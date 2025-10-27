/**
 * @oas [get] /store/banners/{type}
 * operationId: GetStoreBannersByType
 * summary: Retrieve banners by type (Store)
 * description: Retrieve active banners for a specific type (mobile or desktop) with a maximum of 5 banners for the storefront.
 * tags:
 *   - Store Banners
 * parameters:
 *   - in: path
 *     name: type
 *     schema:
 *       type: string
 *       enum: [mobile, desktop]
 *     required: true
 *     description: Banner type
 * responses:
 *   "200":
 *     description: List of active banners for the specified type
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
	const bannerModuleService: any = req.scope.resolve("bannerModuleService");

	try {
		const { type } = req.params;

		// Only return active banners for the storefront
		const banners = await bannerModuleService.getActiveBannersByType(type);

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
