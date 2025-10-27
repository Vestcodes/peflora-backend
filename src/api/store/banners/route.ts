/**
 * @oas [get] /store/banners
 * operationId: GetStoreBanners
 * summary: Retrieve all banners (Store)
 * description: Retrieve all active banners for both mobile and desktop types with a maximum of 5 banners per type for the storefront.
 * tags:
 *   - Store Banners
 * responses:
 *   "200":
 *     description: List of all active banners grouped by type
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
	const bannerService = req.scope.resolve("banner") as {
		getActiveBannersByType: (type: string) => Promise<any[]>;
	};

	try {
		// Get active banners for both types
		const [mobileBanners, desktopBanners] = await Promise.all([
			bannerService.getActiveBannersByType("mobile"),
			bannerService.getActiveBannersByType("desktop"),
		]);

		// Ensure we don't return more than 5 banners per type
		const banners = {
			mobile: mobileBanners.slice(0, 5),
			desktop: desktopBanners.slice(0, 5),
		};

		res.json({
			banners,
			count: {
				mobile: banners.mobile.length,
				desktop: banners.desktop.length,
			},
			max_allowed_per_type: 5,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to retrieve banners",
			error: error.message,
		});
	}
};
