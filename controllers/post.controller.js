import { Post } from "../models/post.model.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();


export const createPost = async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET_KEY, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
        res.json(postDoc);
    });

}

export const getAllPosts = async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['email'])
            .sort({ createdAt: -1 })
            .limit(20)
    );
}

export const getPost = async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['email']);
    res.json(postDoc);
}


export const editPost = async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET_KEY, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('you are not the author');
        }
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        });

        res.json(postDoc);
    });
}


export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        
        const postDoc = await Post.findById(id);
        await postDoc.deleteOne();
        res.status(200).json({
            message: "Post Deleted!",
        });

    } catch (error) {
        res.status(500).json({
            message: "Could not delete Task",
        })
    }
}