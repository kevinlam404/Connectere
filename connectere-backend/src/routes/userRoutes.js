//Create profile update route
const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { avatar: req.body.avatar , bio: req.body.bio, status: req.body.status },
            { new: true }
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;