import mongoose from "mongoose";

const authSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },   
});

const User = mongoose.model("User", authSchema);
export default User;