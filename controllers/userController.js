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
    const { userName, email } = req.body;

    const users = await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        userName,
        email,
      },
      { new: true }
    );

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
