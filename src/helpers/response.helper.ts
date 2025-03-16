import { Response } from "express"

const responseHelper = (
  res: Response,
  statusCode: number,
  data: any,
  message: string
) => {
  res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  })
}

export default responseHelper
