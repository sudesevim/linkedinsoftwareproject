import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPost, getFeedPosts, deletePost, getPostById, createComment, likePost, updatePost, reportPost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", protectRoute, getFeedPosts);
router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.get("/:id", protectRoute, getPostById);
router.put("/update/:id", protectRoute, updatePost);
router.post("/:id/like", protectRoute, likePost);
router.post("/:id/comment", protectRoute, createComment);
router.post("/:id/report", protectRoute, reportPost);

export default router;