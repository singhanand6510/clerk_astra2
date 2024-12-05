export interface User {
  id: string
  clerkId: string
  email: string
  username?: string
  photo?: string
  firstName?: string
  lastName?: string
  planId: number
  creditBalance: number
  createdAt: Date
}

export const defaultUser: Omit<User, "id" | "clerkId" | "email"> = {
  username: "",
  photo: "",
  firstName: "",
  lastName: "",
  planId: 1,
  creditBalance: 3,
  createdAt: new Date(),
}
