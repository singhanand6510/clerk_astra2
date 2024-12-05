import { Webhook } from "svix"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
// import * as uuid from "uuid"
import { NextResponse } from "next/server"
import { createUser } from "@/lib/database/actions/user.actions"

// const uuidv4 = uuid.v4

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error("Error: Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local")
  }

  // Create new Svix instance with secret
  const wh = new Webhook(WEBHOOK_SECRET)

  // Get headers
  const headerPayload = headers()
  const svix_id = (await headerPayload).get("svix-id")
  const svix_timestamp = (await headerPayload).get("svix-timestamp")
  const svix_signature = (await headerPayload).get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error: Could not verify webhook:", err)
    return new Response("Error: Verification error", {
      status: 400,
    })
  }

  // Do something with payload
  // For this guide, log payload to console

  const id = evt.data.id as string
  const eventType = evt.type

  // if (eventType === "user.created") {
  //   const { id, username, email_addresses } = evt.data
  //   console.log("Our User ", id, username, email_addresses[0].email_address)
  //   //call server action to create user to database

  //   NextResponse.json("User created")
  // }

  if (eventType === "user.created") {
    const { email_addresses, id, username, image_url, first_name, last_name } = evt.data
    console.log("Our User ", email_addresses[0].email_address, id, username, image_url, first_name, last_name)

    try {
      const user = {
        // _id: uuidv4(), // UUID for _id
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username || "",
        firstName: first_name || "",
        lastName: last_name || "",
        photo: image_url,
        createdAt: new Date(), // Optional creation date
      }

      const newUser = await createUser(user)

      console.log("User created:", newUser)

      // await clerkClient.users.updateUserMetadata(id, {
      //   publicMetadata: {
      //     userId: newUser._id,
      //   },
      // })

      return NextResponse.json({ message: "New user created", user: newUser })
    } catch (error) {
      console.error("Error creating user in AstraDB:", (error as Error).message)
      return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 })
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data
    console.log("Our deleted user details:", id)

    //call server action to delete user from database

    NextResponse.json("deleted successfully")
  }

  if (eventType === "user.updated") {
    const { id, username, email_addresses } = evt.data
    console.log("Our updated user details", id, username, email_addresses)

    //call server action to update user on the database
  }

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log("Webhook body:", body)

  return new Response("everything good", { status: 200 })
}
