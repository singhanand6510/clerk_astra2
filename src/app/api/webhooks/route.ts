import { Webhook } from "svix"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"

import { NextResponse } from "next/server"

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

  const eventType = evt.type

  if (eventType === "user.created") {
    const { id, username, email_addresses } = evt.data
    console.log("Our User ", id, username, email_addresses[0].email_address)
    //call server action to create user to database

    NextResponse.json("User created")
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

  return new Response("everything good", { status: 200 })
}
