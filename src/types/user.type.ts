import { Document } from "mongoose"

export default interface UserType extends Document {
  _id: string
  firstName: string
  lastName: string
  email: string
  password: string
  role: "user" | "admin"
}
