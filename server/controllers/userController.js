import User from "../models/authModel.js";

const fetchUsers = async (req, res) => {
    try {
      const users = await User.find();
      const filteredUsers = users.filter(
        (user) => user._id.toString() !== req.user._id.toString()
      );
      return res.status(200).json({ success: true, users: filteredUsers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { fetchUsers };
