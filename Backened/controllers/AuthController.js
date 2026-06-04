import User from "../models/UserModel.js";
import { createSecretToken } from "../util/SecretToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser)
      return res.status(400).json({ message: "User already exists", success: false });

    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,//needs to be done true while production
      sameSite: "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,

    });
    res.status(201).json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required", success: false });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Incorrect password or email", success: false });

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.status(401).json({ message: "Incorrect password", success: false });
    }

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, //needs to be done true while production
      sameSite: "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "User logged in successfully", success: true });

    next();
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateProfile = async (req,res) => {
  const token = req.cookies.token;

  const decoded = jwt.verify(token,process.env.TOKEN_KEY);

  const user = await User.findByIdAndUpdate(
    decoded.id,
    {
      username:req.body.username
    },
    {
      new:true
    }
  );

  res.json({
    success:true,
    username:user.username
  });
}