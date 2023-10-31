import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ name, email, password: hashedPassword });

        // res.json(user);
        return res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: "An error occured while signup" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid Email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            jwt.sign(
                { email, id: user._id },
                process.env.SECRET_KEY,
                {},
                (err, token) => {
                    if (err) {
                        throw err;
                    } else {
                        res.cookie("token", token).json({
                            email,
                            id: user._id,
                        });
                    }
                }
            );
        } else {
            return res.status(400).json({ error: "Invalid Password" });
        }

        // return res.status(200).json({ message: "User logged in successfully" });
    } catch (error) {
        return res.status(500).json({ error: "An error occured while login" });
    }
};

export const profile = (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    jwt.verify(token, process.env.SECRET_KEY, {}, (err, info) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        res.json(info);
    });
    res.json(info);
};

export const logout = (req, res) => {
    res
        .cookie("token", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
            secure: process.env.NODE_ENV === "Development" ? false : true,
        })
        .json({ message: "User logged out successfully" });
};
