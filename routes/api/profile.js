const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

//Model
const Profile = require("../../models/Profile");
const validateProfileInput = require("../../validation/profile");

//@route route get api/profile
//@desc  curent user profile
//@access private
router.get("/me", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(200).json({
        success: false,
        create_profile: true,
        errorMessage: "Please create your profile",
      });
    }
    const userInfo = await User.findOne({ _id: req.user.id }).select("name");

    if (userInfo) {
      return res
        .status(200)
        .json({ success: true, profile: profile, name: userInfo.name });
    } else return res.status(200).json({ success: true, profile: profile });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, errorMessage: "Something went wrong ..." });
  }
});

//@route  GET route get api/profile/all
//@desc   all users profile
//@access public

router.get("/all", async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.find();
    if (!profile) {
      return res
        .status(200)
        .json({ success: false, errorMessage: "Profile not found" });
    }
    return res.json({ success: true, data: profile });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, errorMessage: "Something went wrong ..." });
  }
});

//@route  POST route get api/profile
//@desc   create user profile
//@access private
router.post("/", auth, async (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);
  if (!isValid) {
    return res.status(200).json({ success: false, errorMessage: errors });
  }
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  profileFields.followers = [];
  profileFields.following = [];
  try {
    const profile_handle = await Profile.findOne({
      handle: profileFields.handle,
    });
    if (profile_handle && profile_handle.user.toString() !== req.user.id) {
      return res
        .status(200)
        .json({ success: false, errorMessage: "Handle already Exist" });
    }
    const profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      //update
      profileFields.followers = profile.followers || [];
      profileFields.following = profile.following || [];
      const profile_updated = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      if (profile_updated) {
        return res.status(200).json({ success: true, data: profile_updated });
      }
    } else {
      const profile_created = await new Profile(profileFields).save();
      if (profile_created)
        return res.status(201).json({ success: true, data: profile_created });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, errorMessage: "Something went wrong ..." });
  }
});

//@route  Post route get api/profile/follow/
//@desc   update follower and following count
//@access private

router.post("/follow", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(200).json({
        success: false,
        create_profile: true,
        errorMessage: "Create your profile first",
      });
    }
    const { following_user } = req.body;
    if (following_user === req.user.id)
      return res
        .status(200)
        .json({ success: false, errorMessage: "Can't follow yourself" });
    const following_profile = await Profile.findOne({
      user: following_user,
    });
    if (!following_profile)
      return res
        .status(200)
        .json({ success: false, errorMessage: "user does not exist" });
    const already_followed = profile.following.find(
      (fu) => fu.user.toString() == following_profile.user
    );
    if (already_followed)
      return res.status(400).json({
        success: false,
        errorMessage: "Can't follow already followed user",
      });
    profile.following.push({
      user: following_profile.user,
      handle: following_profile.handle,
    });
    profile.save();
    following_profile.followers.push({
      user: req.user.id,
      handle: profile.handle,
    });
    following_profile.save();
    return res.status(200).json({
      success: true,
      message: "Successfully followed the user",
    });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, errorMessage: "Something went wrong ..." });
  }
});

//@route  Post route get api/profile/unfollow
//@desc   update follower and following count
//@access private

router.post("/unfollow", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(200).json({
        success: false,
        create_profile: true,
        errorMessage: "Create your profile first",
      });
    }
    const { unfollowing_user } = req.body;
    if (unfollowing_user === req.user.id)
      return res
        .status(200)
        .json({ success: false, errorMessage: "Can't unfollow yourself" });
    const unfollowing_profile = await Profile.findOne({
      user: unfollowing_user,
    });
    if (!unfollowing_profile)
      return res
        .status(200)
        .json({ success: false, errorMessage: "user does not exist" });
    const followed_index = profile.following.findIndex(
      (fu) => fu.user.toString() == unfollowing_profile.user
    );
    if (followed_index === -1)
      return res.status(200).json({
        success: false,
        errorMessage: "you haven't followed the user",
      });

    profile.following.splice(followed_index, 1);
    await profile.save();
    const unfollow_index = unfollowing_profile.followers.findIndex(
      (following_profile) => following_profile.user.toString() == req.user.id
    );
    if (unfollow_index !== -1) {
      unfollowing_profile.followers.splice(unfollow_index, 1);
      await unfollowing_profile.save();
    }
    return res.status(200).json({
      success: true,
      message: "Successfully unfollowed the user",
    });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, errorMessage: "Something went wrong ..." });
  }
});

//@route  Get route get api/profile/followers/
//@desc   get followers
//@access public

router.get("/followers/:user_id", async (req, res) => {
  try {
    let profile = await Profile.findOne({ handle: req.params.user_id });
    if (!profile) {
      profile = await Profile.findOne({ user: req.params.user_id });
      if (!profile)
        return res
          .status(200)
          .json({ success: true, message: "Profile not found" });
    }
    const followers = profile.followers;
    return res.status(200).json({ success: true, followers: followers });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, errorMessage: "Something went wrong ..." });
  }
});

//@route  Get route get api/profile/followers/
//@desc   get following user
//@access public

router.get("/following/:user_id", async (req, res) => {
  try {
    let profile = await Profile.findOne({ handle: req.params.user_id });
    if (!profile) {
      profile = await Profile.findOne({ user: req.params.user_id });
      if (!profile)
        return res
          .status(200)
          .json({ success: true, message: "Profile not found" });
    }
    const following = profile.following;
    return res.status(200).json({ success: true, following: following });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, errorMessage: "Something went wrong ..." });
  }
});

//@route  Get route get api/profile/followers/
//@desc   get followers
//@access private

router.get("/followers_by_handle/:handle", async (req, res) => {
  try {
    const profile = await Profile.findOne({ handle: req.params.handle });
    if (!profile) {
      return res
        .status(200)
        .json({ success: false, message: "Profile not exist" });
    }
    const followers = profile.followers;
    return res.json({ success: true, data: followers });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, errorMessage: "Something went wrong ..." });
  }
});

//@route  GET route get api/profile/handle/:handle
//@desc   users profile
//@access public

router.get("/handle/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      handle: req.params.user_id,
    });

    if (!profile)
      return res
        .status(200)
        .json({ success: false, errorMessage: "Profile not found" });

    return res.status(200).json({ success: true, profile: profile });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, errorMessage: "Something went wrong ..." });
  }
});

module.exports = router;
