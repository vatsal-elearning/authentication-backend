import { Request, Response, NextFunction } from "express"

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500
  const message = err.message || "Internal Server Error"

  switch (statusCode) {
    case 400:
      res
        .status(statusCode)
        .json({ success: false, message: "Bad Request", error: message })
      break
    case 404:
      res
        .status(statusCode)
        .json({ success: false, message: "Not Found", error: message })
      break
    case 409:
      res
        .status(statusCode)
        .json({ success: false, message: "Conflict", error: message })
      break
    default:
      res.status(statusCode).json({
        success: false,
        message: "Internal Server Error",
        error: message,
      })
      break
  }
  next()
}

export default errorMiddleware
