const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
    {
        profileName: { type: String, trim: true , required: true },
        username :{ type : String, unique : true, trim : true},
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: { type: String, required: true , select: false},
        profilePicture: { type: String, default: "" },
        phoneNumber: { type: String, unique: true, sparse: true },
        bio: { type: String, default: "" },
        contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
        blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
        groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
        lastSeen: { type: Date, default: Date.now },
        isOnline: { type: Boolean, default: false },
        status: { type: String, default: "Hey there! I am using Tempesgram" },
        isVerified: { type: Boolean, default: false },
        otp: { type: String},
        otpExpires: { type: Date },
        resetToken: { type: String},
        resetTokenExpires: { type: Date },
        privacySettings: {
            lastSeen: {
                type: String,
                enum: ["everyone", "contacts", "nobody"],
                default: "everyone",
            },
            isOnline: {
                type: String,
                enum: ["everyone", "contacts", "nobody"],
                default: "everyone",
            },
            profilePicture: {
                type: String,
                enum: ["everyone", "contacts", "nobody"],
                default: "everyone",
            },
        },
    },
    { timestamps: true }
);

const User = model("User", UserSchema);

module.exports = User;
