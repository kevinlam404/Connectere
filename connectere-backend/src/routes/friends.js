const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

//Send friend request
router.post("/request/:id", auth, async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const toUserId = req.params.id;

    if (fromUserId === toUserId) {
      return res.status(400).json({ message: "Cannot add yourself" });
    }

    const receiver = await User.findById(toUserId);
    const sender = await User.findById(fromUserId);

    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    // prevent duplicate requests
    if (!receiver.friendRequests.includes(fromUserId)) {
      receiver.friendRequests.push(fromUserId);
      await receiver.save();
    }

    res.json({ message: "Friend request sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

//Accept friend request
router.post("/accept/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const fromId = req.params.id;

    const user = await User.findById(userId);
    const fromUser = await User.findById(fromId);

    if (!user || !fromUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // add to friends list (both sides)
    if (!user.friends.includes(fromId)) {
      user.friends.push(fromId);
    }

    if (!fromUser.friends.includes(userId)) {
      fromUser.friends.push(userId);
    }

    await user.save();
    await fromUser.save();

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

//Get friends list
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "friends",
      "username avatar status"
    );

    res.json(user.friends);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

//Get friend requests
router.get("/requests", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "friendRequests",
      "username avatar"
    );

    res.json(user.friendRequests);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;