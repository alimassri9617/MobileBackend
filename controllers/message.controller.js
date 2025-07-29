// import Conversation from "../models/conversation.model.js";
// import Message from "../models/message.model.js";
// import { User } from "../models/user.model.js";
// import { getReceiverSocketId, getIO } from "../socket/socket.js";
// import notificationService from "../utils/NotificationService.js";

// export const sendMessage = async (req, res) => {
//   try {
//     const { message }         = req.body;
//     const receiverId          = req.params.id;
//     const senderId            = req.user._id;

//     // 1. Find or create the conversation
//     let conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] },
//     });
//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [senderId, receiverId],
//       });
//     }

//     // 2. Create & save the new message
//     const newMessage = new Message({ senderId, receiverId, message });
//     conversation.messages.push(newMessage._id);
//     await Promise.all([conversation.save(), newMessage.save()]);

//     // 3. Emit the normal chat events
//     const io              = getIO();
//     const receiverSocket  = getReceiverSocketId(receiverId);
//     if (receiverSocket) {
//       io.to(receiverSocket).emit("newMessage", newMessage);

//       const unreadCount = await Message.countDocuments({
//         receiverId,
//         senderId,
//         read: false,
//       });
//       io.to(receiverSocket).emit("updateUnreadCount", {
//         userId: senderId,
//         unreadCount,
//       });
//     }

//     // 4. If the text contains "@important", send a notification
//     if (message.includes("@important")) {
//       // notify the receiver that an important message arrived
//       await notificationService.notifyUsers({
//         recipients: [receiverId],
//         sender: senderId,
//         type: "chat",                             // or "important"
//         message: message.slice(0, 35),
//         data: {
//           messageId: newMessage._id,
//           conversationId: conversation._id,     
//           type: "Chat",
//         },
//       });
//     }

//     return res.status(201).json(newMessage);
//   } catch (error) {
//     console.error("Error in sendMessage controller:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getMessages = async (req, res) => {
//   try {
//     const { id: userToChatId } = req.params;
//     const senderId = req.user._id;

//     const conversation = await Conversation.findOne({
//       participants: { $all: [senderId, userToChatId] },
//     }).populate("messages");

//     if (!conversation) return res.status(200).json([]);

//     const messages = conversation.messages;

//     res.status(200).json(messages);
//   } catch (error) {
//     console.log("Error in getMessages controller: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getConversationsWithUnreadCount = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const users = await User.find({ _id: { $ne: userId } }).select(
//       "_id firstName lastName profilePic role Department"
//     );

//     const result = await Promise.all(
//       users.map(async (user) => {
//         const conversation = await Conversation.findOne({
//           participants: { $all: [userId, user._id] },
//         }).populate("messages");

//         let unreadCount = 0;
//         if (conversation) {
//           unreadCount = await Message.countDocuments({
//             receiverId: userId,
//             senderId: user._id,
//             read: false,
//           });
//         }

//         return {
//           _id: user._id,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           profilePic: user.profilePic,
//           role: user.role,
//           Department: user.Department,
//           unreadCount,
//         };
//       })
//     );

//     res.status(200).json(result);
//   } catch (error) {
//     console.log(
//       "Error in getConversationsWithUnreadCount controller: ",
//       error.message
//     );
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const markMessagesRead = async (req, res) => {
//   try {
//     const userId       = req.user._id;
//     const { id: otherId } = req.params;

//     // Load the conversation
//     const conversation = await Conversation.findOne({
//       participants: { $all: [userId, otherId] },
//     }).populate("messages");
//     if (!conversation) {
//       return res.status(404).json({ error: "Conversation not found" });
//     }

//     // Mark all unread messages as read
//     await Message.updateMany(
//       {
//         _id: { $in: conversation.messages },
//         receiverId: userId,
//         read: false,
//       },
//       { $set: { read: true } }
//     );

//     // Emit updated unreadCount = 0
//     const io = getIO();
//     const userSocketId = getReceiverSocketId(userId);
//     if (userSocketId) {
//       io.to(userSocketId).emit("updateUnreadCount", {
//         userId,
//         unreadCount: 0,
//       });
//     }

//     return res.status(200).json({ message: "Messages marked as read" });
//   } catch (error) {
//     console.error("Error in markMessagesRead controller:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

//-----------------------------------------------------------------------------------------------------------
// import Conversation from "../models/conversation.model.js";
// import Message from "../models/message.model.js";
// import { User } from "../models/user.model.js";
// import { getReceiverSocketId, getIO } from "../socket/socket.js";
// import notificationService from "../utils/NotificationService.js";
// import UserToken from "../models/UserToken.model.js";
// import axios from "axios";
// var usernamewithdivacetoken=[
//   {
//     username:"ali",
//     deviceToken:"",
//   }
//   ,
//   {
//     username:"Mohamad",
//     deviceToken:"",
//   }
//   ,
//    {
//     username:"Nour",
//     deviceToken:"",
//   }
//   ,
//    {
//     username:"Pauline",
//     deviceToken:"",
//   }
//   ,
//    {
//     username:"UniAssist",
//     deviceToken:"",
//   }
//   ,
// ]
// // Send a message between users
// export const sendMessage = async (req, res) => {
//   try {
//     const { message } = req.body;
//     const receiverId = req.params.id;
//     const senderId = req.user._id;

//     const {usertokendevice ,sendername} = req.body;

    
    

//     // 1. Find or create the conversation
//     let conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] },
//     });
//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [senderId, receiverId],
//       });
//     }

//     // 2. Create & save the new message
//     const newMessage = new Message({ senderId, receiverId, message });
//     conversation.messages.push(newMessage._id);
//     await Promise.all([conversation.save(), newMessage.save()]);

//     // 3. Emit socket events to the receiver
//     const io = getIO();
//     const receiverSocket = getReceiverSocketId(receiverId);
//     if (receiverSocket) {
//       io.to(receiverSocket).emit("newMessage", newMessage);

//       const unreadCount = await Message.countDocuments({
//         receiverId,
//         senderId,
//         read: false,
//       });
//       io.to(receiverSocket).emit("updateUnreadCount", {
//         userId: senderId,
//         unreadCount,
//       });
//     }

//     // 4. Send Expo push notification
//     const tokenDoc = await UserToken.findOne({ userId: receiverId });

//     if (tokenDoc?.token) {
//       await axios.post("https://exp.host/--/api/v2/push/send", {
//         to: tokenDoc.token,
//         sound: "default",
//         title: "New Message",
//         body: `${req.user.firstName || "Someone"} sent you a message.`,
//         data: {
//           messageId: newMessage._id,
//           conversationId: conversation._id,
//         },
//       });
//     }

//     // 5. Optional: Notify on @important messages
//     if (message.includes("@important")) {
//       await notificationService.notifyUsers({
//         recipients: [receiverId],
//         sender: senderId,
//         type: "chat",
//         message: message.slice(0, 35),
//         data: {
//           messageId: newMessage._id,
//           conversationId: conversation._id,
//           type: "Chat",
//         },
//       });
//     }

//     return res.status(201).json(newMessage);
//   } catch (error) {
//     console.error("Error in sendMessage controller:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };



// // Get all messages between two users
// export const getMessages = async (req, res) => {
//   try {

//     const { name } = req.body;

//     if (typeof name === "string" && name.includes("ali")) {
//       const {token} = req.body;
//       if (!token) {
//         return res.status(400).json({ error: "Token is required" });
//       }
//     }


//     const { id: userToChatId } = req.params;
//     const senderId = req.user._id;

//     const conversation = await Conversation.findOne({
//       participants: { $all: [senderId, userToChatId] },
//     }).populate("messages");

//     if (!conversation) return res.status(200).json([]);

//     const messages = conversation.messages;

//     res.status(200).json(messages);
//   } catch (error) {
//     console.log("Error in getMessages controller: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Get all users with unread message count
// export const getConversationsWithUnreadCount = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const users = await User.find({ _id: { $ne: userId } }).select(
//       "_id firstName lastName profilePic role Department"
//     );

//     const result = await Promise.all(
//       users.map(async (user) => {
//         const conversation = await Conversation.findOne({
//           participants: { $all: [userId, user._id] },
//         }).populate("messages");

//         let unreadCount = 0;
//         if (conversation) {
//           unreadCount = await Message.countDocuments({
//             receiverId: userId,
//             senderId: user._id,
//             read: false,
//           });
//         }

//         return {
//           _id: user._id,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           profilePic: user.profilePic,
//           role: user.role,
//           Department: user.Department,
//           unreadCount,
//         };
//       })
//     );

//     res.status(200).json(result);
//   } catch (error) {
//     console.log(
//       "Error in getConversationsWithUnreadCount controller: ",
//       error.message
//     );
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Mark messages as read between current user and another
// export const markMessagesRead = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { id: otherId } = req.params;

//     const conversation = await Conversation.findOne({
//       participants: { $all: [userId, otherId] },
//     }).populate("messages");

//     if (!conversation) {
//       return res.status(404).json({ error: "Conversation not found" });
//     }

//     await Message.updateMany(
//       {
//         _id: { $in: conversation.messages },
//         receiverId: userId,
//         read: false,
//       },
//       { $set: { read: true } }
//     );

//     const io = getIO();
//     const userSocketId = getReceiverSocketId(userId);
//     if (userSocketId) {
//       io.to(userSocketId).emit("updateUnreadCount", {
//         userId,
//         unreadCount: 0,
//       });
//     }

//     return res.status(200).json({ message: "Messages marked as read" });
//   } catch (error) {
//     console.error("Error in markMessagesRead controller:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };




// ================= BACKEND CONTROLLER ===================

// controllers/message.controller.js

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSocketId, getIO } from "../socket/socket.js";
import notificationService from "../utils/NotificationService.js";
import UserToken from "../models/UserToken.model.js";
import axios from "axios";

let uniidWithDeviceToken = [
 
];
function getDeviceTokenByUniid(receiverUniid) {
  const entry = uniidWithDeviceToken.find(item => item.uniid === receiverUniid);
  return entry ? entry.token : null;
}

export const getDeviceToken = async (req, res) => {
  const { token, uniid } = req.body;

  if (!token || !uniid) {
    return res.status(400).json({ error: "Token and uniid are required" });
  }

  const index = uniidWithDeviceToken.findIndex(u => u.uniid === uniid);

  if (index !== -1) {
    // Update existing token
    uniidWithDeviceToken[index].token = token;
  } else {
    // Add new entry
    uniidWithDeviceToken.push({ uniid, token });
  }

  console.log(uniidWithDeviceToken);
  return res.status(200).json({ message: "Device token saved successfully" });
};



// export const sendMessage = async (req, res) => {
//   try {
//     const { message } = req.body;
//     const receiverId = req.params.id;
//     const senderId = req.user._id;

//     let conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] },
//     });

//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [senderId, receiverId],
//       });
//     }

//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       message,
//     });

//     conversation.messages.push(newMessage._id);
//     await Promise.all([conversation.save(), newMessage.save()]);

//     const io = getIO();
//     const receiverSocketId = getReceiverSocketId(receiverId);

//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage);

//       const unreadCount = await Message.countDocuments({
//         receiverId,
//         senderId,
//         read: false,
//       });

//       io.to(receiverSocketId).emit("updateUnreadCount", {
//         userId: senderId,
//         unreadCount,
//       });
//     }

//     if (message.includes("@important")) {
//       await notificationService.notifyUsers({
//         recipients: [receiverId],
//         sender: senderId,
//         type: "chat",
//         message: message.slice(0, 35),
//         data: {
//           messageId: newMessage._id,
//           conversationId: conversation._id,
//           type: "Chat",
//         },
//       });
//     }

//     // 🔔 Step 5: Send Expo Push Notification to receiver if token exists
//     console.log("receiverId: ", receiverId);
//    const getdevicetoken=getDeviceTokenByUniid(receiverId);
//     console.log("getdevicetoken: ", getdevicetoken);

   
//     if(getdevicetoken){
//        axios.post("https://exp.host/--/api/v2/push/send", {
//         to: getdevicetoken,
//         sound: "default",
//         title: "📩 New Message",
//         body: message.length > 100 ? message.slice(0, 100) + "..." : message,
//         data: {
//           type: "Chat",
//           senderId,
//           receiverId,
//           messageId: newMessage._id,
//         },
//       });

//       console.log(`✅ Notification sent to ${receiverUniid}`);
//     }
//     // } else {
//     //   console.warn(`⚠️ No Expo token found for ${receiverUniid}`);
//     // }

//     return res.status(201).json(newMessage);
//   } catch (error) {
//     console.error("❌ Error in sendMessage:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    const io = getIO();
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);

      const unreadCount = await Message.countDocuments({
        receiverId,
        senderId,
        read: false,
      });

      io.to(receiverSocketId).emit("updateUnreadCount", {
        userId: senderId,
        unreadCount,
      });
    }

    // Notify if @important
    if (message.includes("@important")) {
      await notificationService.notifyUsers({
        recipients: [receiverId],
        sender: senderId,
        type: "chat",
        message: message.slice(0, 35),
        data: {
          messageId: newMessage._id,
          conversationId: conversation._id,
          type: "Chat",
        },
      });
    }

    // 🔔 Send Expo Push Notification if token found
    const token = getDeviceTokenByUniid(receiverId);
    console.log("receiverId:", receiverId);
    console.log("Expo token:", token);

    if (token) {
      await axios.post("https://exp.host/--/api/v2/push/send", {
        to: token,
        sound: "default",
        title: "📩 New Message",
        body: message.length > 100 ? message.slice(0, 100) + "..." : message,
        data: {
          type: "Chat",
          senderId,
          receiverId,
          messageId: newMessage._id,
        },
      });

      console.log(`✅ Notification sent to ${receiverId}`);
    } else {
      console.warn(`⚠️ No Expo token found for ${receiverId}`);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Error in sendMessage:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const { name } = req.body;

    if (typeof name === "string" && name.includes("ali")) {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }
    }

    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all users with unread message count
export const getConversationsWithUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const users = await User.find({ _id: { $ne: userId } }).select(
      "_id firstName lastName profilePic role Department"
    );

    const result = await Promise.all(
      users.map(async (user) => {
        const conversation = await Conversation.findOne({
          participants: { $all: [userId, user._id] },
        }).populate("messages");

        let unreadCount = 0;
        if (conversation) {
          unreadCount = await Message.countDocuments({
            receiverId: userId,
            senderId: user._id,
            read: false,
          });
        }

        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePic: user.profilePic,
          role: user.role,
          Department: user.Department,
          unreadCount,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.log(
      "Error in getConversationsWithUnreadCount controller: ",
      error.message
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mark messages as read between current user and another
export const markMessagesRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: otherId } = req.params;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    await Message.updateMany(
      {
        _id: { $in: conversation.messages },
        receiverId: userId,
        read: false,
      },
      { $set: { read: true } }
    );

    const io = getIO();
    const userSocketId = getReceiverSocketId(userId);
    if (userSocketId) {
      io.to(userSocketId).emit("updateUnreadCount", {
        userId,
        unreadCount: 0,
      });
    }

    return res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error in markMessagesRead controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
//-----------------------------------------------------------------------------------------------------------