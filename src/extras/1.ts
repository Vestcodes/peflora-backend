/**
 * @oas [get] /store/products-bought-together/{productId}
 * operationId: GetProductsBoughtTogether
 * summary: List of products bought together
 * description: Returns a list of products that are frequently bought together with the specified product ID.
 * tags:
 *   - Store
 * parameters:
 *   - in: path
 *     name: productId
 *     required: true
 *     schema:
 *       type: string
 *     description: ID of the product for which you are looking for other frequently bought products
 * responses:
 *   "200":
 *     description: productId passed in URL. Returns an empty array if it cannot be found in the database.
 *     content:
 *       application/json:
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId1:
 *                 type: string
 *               productId2:
 *                 type: string
 *               frequency:
 *                 type: number
 *   "404":
 *     description: productId not passed in URL
 */