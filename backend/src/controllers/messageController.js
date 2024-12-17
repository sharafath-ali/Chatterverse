import User from "../models/user.model"
import Message from "../models/message.model"

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
    const message = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    })
    return res.status(200).json(message)
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message })
  }
}