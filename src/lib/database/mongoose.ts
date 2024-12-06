import mongoose from "mongoose"
import { driver, createAstraUri } from "stargate-mongoose"

export const connectToAstraDb = async (): Promise<void> => {
  try {
    const uri = createAstraUri(process.env.ASTRA_DB_API_END_POINT!, process.env.ASTRA_DB_APPLICATION_TOKEN!)

    // If already connected, disconnect before reconnecting
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
      console.log("Disconnected previous Mongoose connection.")
    }

    // Set necessary Mongoose configurations
    mongoose.set("autoCreate", true)
    mongoose.setDriver(driver)

    // Establish the connection to AstraDB
    await mongoose.connect(uri, {
      isAstra: true,
    })

    console.log("Connected to AstraDB successfully.")
  } catch (error) {
    console.error("Error connecting to AstraDB:", error)
    throw error
  }
}
