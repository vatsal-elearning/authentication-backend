import { Request } from "express"

// Extend the Express Request type
export interface AuthenticatedRequest extends Request {
  user?: any
}
