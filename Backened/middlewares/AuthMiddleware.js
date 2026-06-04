import User from "../models/UserModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const userVerification = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ status: false, message: "Token does not exist" });
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
            if (err) return res.status(401).json({ status: false, message: "Invalid token" });

            try {
                const user = await User.findById(data.id);

                if (!user) {
                    return res.status(404).json({ success: false, message: "User not found" });
                }
                return res.status(201).json({ status: true, user: user.username });

            } catch (err) {
                console.log(err);

                return res.status(500).json({ status: false, message: "Internal server error" });
            }
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};