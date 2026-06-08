import express from 'express';
import passport from 'passport';
import { createSecretToken } from '../util/SecretToken.js';
import { Signup, Login, Logout,updateProfile } from '../controllers/AuthController.js';
import { userVerification } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login",
        session: true,
    }),

    async (req, res) => {
        const token = createSecretToken(req.user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });
        console.log("Redirecting to chat");
        res.redirect("https://sigmagpt-frontend-pdgt.onrender.com/chat");
    }
);

router.get("/verify", userVerification);
router.get("/logout", Logout);
router.put("/profile", updateProfile);

export default router;