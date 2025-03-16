import { Router } from "express"
import { authMiddleware } from "@middlewares"
import { authController } from "@controllers"

const router = Router()

router.post("/register", authController.register)
router.post("/login", authController.login)

// Protected routes
router.get("/profile", authMiddleware, authController.profile)

router.post("/refresh", authController.refreshToken)
router.post("/logout", authController.logOut)

export default router
