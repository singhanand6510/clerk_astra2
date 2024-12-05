import { Webhook } from "svix"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createUser, updateUser } from "@/lib/database/actions/user.actions"

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

  const eventType = evt.type

  if (eventType === "user.created") {
    const { email_addresses, id, username, image_url, first_name, last_name } = evt.data

    try {
      const user = {
        clerkId: id,
        email: email_addresses[0]?.email_address,
        username: username || undefined,
        firstName: first_name || undefined,
        lastName: last_name || undefined,
        photo: image_url,
      }

      const newUser = await createUser(user)
      console.log("User created:", newUser)

      return NextResponse.json({ message: "New user created", user: newUser })
    } catch (error) {
      console.error("Error creating user in AstraDB:", (error as Error).message)
      return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 })
    }
  }

  if (eventType === "user.updated") {
    const { id, username, email_addresses, image_url, first_name, last_name } = evt.data

    try {
      const updatedUser = await updateUser(id, {
        username: username || undefined,
        email: email_addresses[0]?.email_address,
        photo: image_url,
        firstName: first_name || undefined,
        lastName: last_name || undefined,
      })

      console.log("User updated:", updatedUser)
      return NextResponse.json({ message: "User updated", user: updatedUser })
    } catch (error) {
      console.error("Error updating user in AstraDB:", (error as Error).message)
      return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 })
    }
  }

  // if (eventType === "user.deleted") {
  //   const { id } = evt.data

  //   try {
  //     await deleteUser(id)
  //     console.log("User deleted:", id)
  //     return NextResponse.json({ message: "User deleted successfully" })
  //   } catch (error) {
  //     console.error("Error deleting user from AstraDB:", (error as Error).message)
  //     return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 })
  //   }
  // }

  console.log(`Webhook with an ID of ${evt.data.id} and type of ${eventType}`)
  return new Response("Webhook processed", { status: 200 })
}
