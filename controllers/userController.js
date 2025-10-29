import User from "../models/User.js";

export async function getAvailableUsers(req, res) {
  try {
    const userId = req.user.id;
    const query = req.query.q || "";

    const users = await User.find({
      _id: { $ne: userId }, // exclude
      userName: { $regex: query, $options: "i" },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const { userName, email, avatar } = req.body;

    const users = await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        userName,
        email,
        avatar,
      },
      { new: true }
    );

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
