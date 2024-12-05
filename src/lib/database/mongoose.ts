import { DataAPIClient } from "@datastax/astra-db-ts"

let client: DataAPIClient | null = null
let db: any = null

export async function getAstraClient() {
  if (client === null) {
    client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN!)
    db = client.db(process.env.ASTRA_DB_ENDPOINT!, { keyspace: process.env.ASTRA_DB_KEYSPACE })

    // Test the connection
    try {
      const colls = await db.listCollections()
      console.log("Connected to AstraDB:", colls)
    } catch (error) {
      console.error("Failed to connect to AstraDB:", error)
      throw error
    }
  }
  return db
}

export async function getAstraCollection(collectionName: string) {
  const astraDb = await getAstraClient()
  return astraDb.collection(collectionName)
}
