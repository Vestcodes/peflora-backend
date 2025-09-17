/**
 * @oas [get] /store/products/{id}/reviews
 * operationId: GetStoreProductReviews
 * summary: Retrieve approved reviews for a specific product
 * description: Fetches a list of approved reviews for a given product ID, including pagination and average rating.
 * x-authenticated: false
 * tags:
 *   - Store Reviews
 * parameters:
 *   - in: path
 *     name: id
 *     required: true
 *     schema:
 *       type: string
 *     description: ID of the product
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
 *       default: 10
 *     description: Maximum number of items to return
 *   - in: query
 *     name: order
 *     schema:
 *       type: string
 *       enum: [asc, desc]
 *     description: Order of results
 * responses:
 *   "200":
 *     description: List of approved reviews with average rating
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { PRODUCT_REVIEW_MODULE } from "../../../../../modules/product-review";
import type ProductReviewModuleService from "../../../../../modules/product-review/service";

export const GetStoreReviewsSchema = createFindParams();

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const { id } = req.params;

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const reviewModuleService: ProductReviewModuleService = req.scope.resolve(
        PRODUCT_REVIEW_MODULE,
    );

    const {
        data: reviews,
        metadata: { count, take, skip } = { count: 0, take: 10, skip: 0 },
    } = await query.graph({
        entity: "review",
        filters: {
            product_id: id,
            status: "approved",
        },
        ...req.queryConfig,
    });

    res.json({
        reviews,
        count,
        limit: take,
        offset: skip,
        average_rating: await reviewModuleService.getAverageRating(id),
    });
};
