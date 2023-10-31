import mongoose from "mongoose";
const {Schema} = mongoose;

const postSchema = new mongoose.Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

export const Post = mongoose.model("post", postSchema);