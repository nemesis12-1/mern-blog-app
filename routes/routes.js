import express from 'express';
import { signup, login, profile, logout } from "../controllers/user.controller.js"
import { createPost, getAllPosts, getPost, editPost, deletePost } from '../controllers/post.controller.js';
import multer from "multer";
const uploadMiddleware = multer({ dest: 'uploads/' });


const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', profile);
router.post('/logout', logout);

router.post('/post', uploadMiddleware.single('file'), createPost);
router.get('/post', getAllPosts);
router.get('/post/:id', getPost);
router.put('/post/:id', uploadMiddleware.single('file'), editPost);
router.delete('/post/:id', deletePost);



export default router;