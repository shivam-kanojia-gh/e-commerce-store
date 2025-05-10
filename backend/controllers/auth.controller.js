import { redis } from "../lib/redis.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res
    .cookie("accessToken", accessToken, {
      httpOnly: true, // prevent XSS attacks, cross site scripting attack
      secure: process.env.NODE_ENV === "production", // set to true in production 
      sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true, // prevent XSS attacks, cross site scripting attack
      secure: process.env.NODE_ENV === "production", // set to true in production
      sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export const signup = async (req, res) => {
  // destructure user details
  const { name, email, password } = req.body;

  try {
    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user in db
    const user = await User.create({ name, email, password });

    // authenticate user

    // generate access and refresh token
    const { accessToken, refreshToken } = generateTokens(user._id);

    // store refresh token in redis db
    await storeRefreshToken(user._id, refreshToken);

    // set cookies with access and refresh token
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  res.send("signup route called");
};

export const logout = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
