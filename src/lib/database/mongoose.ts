import mongoose from "mongoose"
import { driver, createAstraUri } from "stargate-mongoose"

export const connectToAstraDb = async (): Promise<void> => {
  const endpoint = process.env.ASTRA_DB_API_ENDPOINT!
  const token = process.env.ASTRA_DB_APPLICATION_TOKEN!

  if (!endpoint || !token) {
    throw new Error("Astra DB API endpoint or application token is missing in environment variables.")
  }

  // Generate Astra DB URI
  const uri = createAstraUri(endpoint, token)

  // Configure mongoose
  mongoose.set("autoCreate", true)
  mongoose.setDriver(driver)

  // Connect to Astra DB
  await mongoose.connect(uri, {
    isAstra: true,
  })
}
