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
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    // destructure user details
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // if user exists and password is correct, authenticate user
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);

      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    // get refresh token from cookies
    const { refreshToken } = req.cookies;

    // delete refresh token from redis db
    if (refreshToken) {
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decodedToken.userId}`);
    }

    // clear access and refresh token cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};
