const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const validatePostInput = require("../../validation/post");

//@route  POST /api/posts/
//@desc   create Post
//@access Private
router.post("/", auth, async (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  if (!isValid) {
    res.status(400).json({ success: false, errorMessage: errors });
  }
  try {
    const handleData = await Profile.findOne({ user: req.user.id }).select(
      "handle"
    );
    if (!handleData)
      return res.status(400).send({
        success: false,
        create_profile: true,
        errorMessage: "Please create your Profile",
      });
    const newPost = {
      description: req.body.description,
      title: req.body.title,
      user: req.user.id,
      handle: handleData.handle,
    };
    const post = await new Post(newPost).save();
    return res
      .status(201)
      .send({ success: true, post: post, msg: "Post created successfully" });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, errorMessage: "Something went wrong.." });
  }
});

//@route  GET /api/post
//@desc   Get Post
//@access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.status(200).json({ success: true, posts: posts }))
    .catch((err) =>
      res.status(500).json({ noposts: "No Post found with that id" })
    );
});

//@route  GET /api/post
//@desc   Get Post
//@access Public
router.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json({ success: true, post: post });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, errorMessage: "Something went wrong" });
  }
});

//@route  POST /api/posts/feed
//@desc   get live feed
//@access Private

router.get("/feed", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        create_profile: true,
        errorMessage: "Profile not found",
      });
    }
    const following = profile.following || [];
    const following_ids = following.map((following) => following.user);
    const feedPosts = await Post.find({ user: { $in: following_ids } }).sort({
      date: -1,
    });
    return res.status(200).json({ success: true, posts: feedPosts });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errorMessage: "Something went wrong" });
  }
});

//@route  POST /api/posts/my_posts
//@desc   get my all the posts
//@access Private

router.get("/my_posts", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        create_profile: true,
        errorMessage: "Profile not found",
      });
    }
    const my_posts = await Post.find({ user: req.user.id }).sort({
      date: -1,
    });
    return res.status(200).json({ success: true, posts: my_posts });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errorMessage: "Something went wrong" });
  }
});

//@route  POST /api/posts/my_posts
//@desc   get user all posts
//@access Public

router.get("/user_posts/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        create_profile: true,
        errorMessage: "Profile not found",
      });
    }
    const my_posts = await Post.find({ user: req.params.user_id }).sort({
      date: -1,
    });
    return res.status(200).json({ success: true, posts: my_posts });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, errorMessage: "Something went wrong" });
  }
});

module.exports = router;
