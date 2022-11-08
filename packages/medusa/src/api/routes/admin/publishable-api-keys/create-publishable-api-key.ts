import { Request, Response } from "express"
import { EntityManager } from "typeorm"

import PublishableApiKeyService from "../../../../services/publishable-api-key"

/**
 * @oas [post] /publishable-api-keys
 * operationId: "PostPublishableApiKeys"
 * summary: "Create a PublishableApiKey"
 * description: "Creates a PublishableApiKey."
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.publishableApiKey.create()
 *         .then(({ publishable_api_key }) => {
 *           console.log(publishable_api_key.id)
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/publishable-api-keys' \
 *       --header 'Authorization: Bearer {api_token}'
 *       -d '{ "created_by": "user_123" }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - PublishableApiKey
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             publishable_api_key:
 *               $ref: "#/components/schemas/publishable_api_key"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res: Response) => {
  const publishableApiKeyService = req.scope.resolve(
    "publishableApiKeyService"
  ) as PublishableApiKeyService

  const manager = req.scope.resolve("manager") as EntityManager

  const loggedInUserId = (req.user?.id ?? req.user?.userId) as string

  const pubKey = await manager.transaction(async (transactionManager) => {
    return await publishableApiKeyService
      .withTransaction(transactionManager)
      .create({ loggedInUserId })
  })

  return res.status(201).json({ publishable_api_key: pubKey })
}