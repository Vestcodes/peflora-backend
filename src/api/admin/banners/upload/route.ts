/**
 * @oas [post] /admin/banners/upload
 * operationId: PostAdminBannersUpload
 * summary: Upload a banner image (Admin)
 * description: Upload a banner image for mobile or desktop with a maximum of 5 banners per type.
 * x-authenticated: true
 * tags:
 *   - Admin Banners
 * requestBody:
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         properties:
 *           type:
 *             type: string
 *             enum: [mobile, desktop]
 *             description: Banner type
 *           title:
 *             type: string
 *             description: Banner title
 *           subtitle:
 *             type: string
 *             description: Banner subtitle (optional)
 *           description:
 *             type: string
 *             description: Banner description (optional)
 *           image:
 *             type: string
 *             description: Base64-encoded image string
 *           cta_text:
 *             type: string
 *             description: Call-to-action text (optional)
 *           cta_link:
 *             type: string
 *             description: Call-to-action link (optional)
 *           background_color:
 *             type: string
 *             description: Background color (optional)
 *           text_color:
 *             type: string
 *             description: Text color (optional)
 *           order:
 *             type: number
 *             description: Display order (optional)
 *         required:
 *           - type
 *           - title
 *           - image
 * responses:
 *   "201":
 *     description: Successfully uploaded banner
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";

export const PostAdminBannersUploadSchema = z.object({
	type: z.enum(["mobile", "desktop"]),
	title: z.string(),
	subtitle: z.string().optional(),
	description: z.string().optional(),
	image: z.string(),
	cta_text: z.string().optional(),
	cta_link: z.string().optional(),
	background_color: z.string().optional(),
	text_color: z.string().optional(),
	order: z.number().optional(),
});

type PostAdminBannersUploadReq = z.infer<typeof PostAdminBannersUploadSchema>;

export const POST = async (
	req: MedusaRequest<PostAdminBannersUploadReq>,
	res: MedusaResponse
) => {
	const bannerModuleService: any = req.scope.resolve("bannerModuleService");

	try {
		const banner = await bannerModuleService.createBanner(req.validatedBody);
		res.status(201).json({ banner });
	} catch (error) {
		if (error.message.includes("Maximum 5 banners")) {
			res.status(400).json({
				message: error.message,
				type: "validation_error",
			});
		} else {
			res.status(500).json({
				message: "Failed to upload banner",
				error: error.message,
			});
		}
	}
};
