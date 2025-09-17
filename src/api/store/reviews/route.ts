/**
 * @oas [post] /store/reviews
 * operationId: PostStoreReview
 * summary: Create a new product review
 * description: Allows a customer to submit a new review for a product.
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/store/reviews' \
 *       -H 'Content-Type: application/json' \
 *       -H 'Authorization: Bearer <token>' \
 *       -d '{"product_id":"prod_123","content":"Great product!","rating":5,"first_name":"John","last_name":"Doe"}'
 * tags:
 *   - Store Reviews
 * requestBody:
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         properties:
 *           title:
 *             type: string
 *             description: Optional title of the review
 *           content:
 *             type: string
 *             description: Content of the review
 *           rating:
 *             type: integer
 *             minimum: 1
 *             maximum: 5
 *           product_id:
 *             type: string
 *           first_name:
 *             type: string
 *           last_name:
 *             type: string
 *         required:
 *           - content
 *           - rating
 *           - product_id
 *           - first_name
 *           - last_name
 * responses:
 *   "200":
 *     description: Successfully created review
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http";

import { z } from "zod";
import { createReviewWorkflow } from "../../../workflows/create-review";

export const PostStoreReviewSchema = z.object({
    title: z.string().optional(),
    content: z.string(),
    rating: z.preprocess((val) => {
        if (val && typeof val === "string") {
            return parseInt(val);
        }
        return val;
    }, z.number().min(1).max(5)),
    product_id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
});

type PostStoreReviewReq = z.infer<typeof PostStoreReviewSchema>;

export const POST = async (
    req: AuthenticatedMedusaRequest<PostStoreReviewReq>,
    res: MedusaResponse,
) => {
    const input = req.validatedBody;

    const { result } = await createReviewWorkflow(req.scope).run({
        input: {
            ...input,
            customer_id: req.auth_context?.actor_id,
        },
    });

    res.json(result);
};
