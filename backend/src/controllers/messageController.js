import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"

export const getUsersForSidebar = async (req, res) => {
  try {
    const id = req.user._id
    const users = await User.find({ _id: { $ne: id } }).select("-password")
    return res.status(200).json(users)
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message })
  }
}

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params
    const currentUserId = req.user._id;
    const messages = await Message.find({
      $or:
        [
          { senderId: currentUserId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: currentUserId }
        ]
    }).sort({ createdAt: 1 })
    return res.status(200).json(messages)
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params
    const { text, image } = req.body
    const senderId = req.user._id;

    let imageUrl = ""
    if (image) {
      const result = await cloudinary.uploader.upload(image, { folder: "messages" });
      imageUrl = result.secure_url
    }
    
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json(newMessage)
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message })
  }
}