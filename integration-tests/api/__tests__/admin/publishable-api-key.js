const path = require("path")
const { IdMap } = require("medusa-test-utils")

const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")
const {
  simplePublishableApiKeyFactory,
} = require("../../factories/simple-publishable-api-key-factory")

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("[MEDUSA_FF_PUBLISHABLE_API_KEYS] Publishable API keys", () => {
  let medusaProcess
  let dbConnection
  const adminUserId = "admin_user"

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_PUBLISHABLE_API_KEYS: true },
      verbose: true,
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/publishable-api-keys/:id", () => {
    const pubKeyId = IdMap.getId("pubkey-get-id")
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simplePublishableApiKeyFactory(dbConnection, {
        id: pubKeyId,
        created_by: adminUserId,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("retrieve a publishable key by id ", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/publishable-api-keys/${pubKeyId}`,
        adminHeaders
      )

      expect(response.status).toBe(200)

      expect(response.data.publishable_api_key).toMatchObject({
        id: pubKeyId,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        created_by: adminUserId,
        revoked_by: null,
        revoked_at: null,
      })
    })
  })

  describe("GET /admin/publishable-api-keys", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simplePublishableApiKeyFactory(dbConnection, {})
      await simplePublishableApiKeyFactory(dbConnection, {})
      await simplePublishableApiKeyFactory(dbConnection, {})
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("list publishable keys", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/publishable-api-keys?limit=2`,
        adminHeaders
      )

      expect(response.data.count).toBe(3)
      expect(response.data.limit).toBe(2)
      expect(response.data.offset).toBe(0)
      expect(response.data.publishable_api_keys).toHaveLength(2)
    })
  })

  describe("POST /admin/publishable-api-keys", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("crete a publishable keys", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/publishable-api-keys`,
        {},
        adminHeaders
      )

      expect(response.status).toBe(201)
      expect(response.data.publishable_api_key).toMatchObject({
        created_by: "admin_user",
        id: expect.any(String),
        revoked_by: null,
        revoked_at: null,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("POST /admin/publishable-api-keys/:id/revoke", () => {
    const pubKeyId = IdMap.getId("pubkey-get-id")
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simplePublishableApiKeyFactory(dbConnection, {
        id: pubKeyId,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("revoke a publishable key", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/publishable-api-keys/${pubKeyId}/revoke`,
        {},
        adminHeaders
      )

      expect(response.status).toBe(200)

      expect(response.data.publishable_api_key).toMatchObject({
        id: pubKeyId,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        revoked_by: adminUserId,
        revoked_at: expect.any(String),
      })
    })
  })

  describe("DELETE /admin/publishable-api-keys/:id", () => {
    const pubKeyId = IdMap.getId("pubkey-get-id")
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simplePublishableApiKeyFactory(dbConnection, {
        id: pubKeyId,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("delete a publishable key", async () => {
      const api = useApi()

      const response1 = await api.delete(
        `/admin/publishable-api-keys/${pubKeyId}`,
        adminHeaders
      )

      expect(response1.status).toBe(200)
      expect(response1.data).toEqual({
        id: pubKeyId,
        object: "publishable_api_key",
        deleted: true,
      })

      try {
        await api.get(`/admin/publishable-api-keys/${pubKeyId}`, adminHeaders)
      } catch (e) {
        expect(e.response.status).toBe(404)
      }
    })
  })
})