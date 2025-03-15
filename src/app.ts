import express from "express"
import cors from "cors"
import { connectDB } from "./config/db"
import router from "@routes"
import { errorMiddleware } from "@middlewares"

const app = express()

// Use JSON parsing middleware
app.use(express.json())

// Use cors
app.use(cors())

app.use("/api", router)

// DB Connection
connectDB()

// Global error handling middleware
app.use(errorMiddleware)

export default app
