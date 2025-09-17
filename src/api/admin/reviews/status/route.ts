/**
 * @oas [post] /admin/reviews/status
 * operationId: PostAdminUpdateReviewsStatus
 * summary: Update status of multiple reviews (Admin)
 * description: Update the status of one or more reviews by providing an array of review IDs and the new status.
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/reviews/status' \
 *       -H 'Content-Type: application/json' \
 *       -d '{"ids":["review_id1","review_id2"],"status":"approved"}'
 * tags:
 *   - Admin Reviews
 * requestBody:
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         properties:
 *           ids:
 *             type: array
 *             items:
 *               type: string
 *             description: Array of review IDs to update
 *           status:
 *             type: string
 *             enum: [pending, approved, rejected]
 *             description: New status for the reviews
 *         required:
 *           - ids
 *           - status
 * responses:
 *   "200":
 *     description: Successfully updated review statuses
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */


import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import { updateReviewWorkflow } from "../../../../workflows/update-review";

export const PostAdminUpdateReviewsStatusSchema = z.object({
	ids: z.array(z.string()),
	status: z.enum(["pending", "approved", "rejected"]),
});

export async function POST(
	req: MedusaRequest<z.infer<typeof PostAdminUpdateReviewsStatusSchema>>,
	res: MedusaResponse,
) {
	const { ids, status } = req.validatedBody;

	const { result } = await updateReviewWorkflow(req.scope).run({
		input: ids.map((id) => ({
			id,
			status,
		})),
	});

	res.json(result);
}
