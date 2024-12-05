import { v4 as uuidv4 } from "uuid"
import { getAstraCollection } from "../mongoose"
import { defaultUser, User } from "../models/user.model"

function generateUniqueId(): string {
  return uuidv4()
}

export async function createUser(userData: Partial<User>): Promise<User> {
  const collection = await getAstraCollection("users")

  if (!userData.email) {
    throw new Error("Email is required to create a user")
  }

  const newUser: User = {
    ...defaultUser,
    ...userData,
    id: generateUniqueId(),
    clerkId: userData.clerkId!,
    email: userData.email,
  }

  await collection.create(newUser.id, newUser)
  return newUser
}

export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  const collection = await getAstraCollection("users")
  const result = await collection.find({ clerkId: clerkId }, { limit: 1 })
  return result.length > 0 ? result[0] : null
}

export async function updateUser(clerkId: string, userData: Partial<User>): Promise<User | null> {
  const collection = await getAstraCollection("users")
  const existingUser = await getUserByClerkId(clerkId)
  if (!existingUser) return null

  const updatedUser = { ...existingUser, ...userData }
  await collection.update(existingUser.id, updatedUser)
  return updatedUser
}

// export async function deleteUser(clerkId: string): Promise<void> {
//   const collection = await getAstraCollection("users")
//   const existingUser = await getUserByClerkId(clerkId)
//   if (existingUser) {
//     await collection.delete(existingUser.id)
//   }
// }
