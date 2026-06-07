import express from 'express';
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from '../util/geminiai.js';
import jwt from "jsonwebtoken";


const router = express.Router();

const getUserId = (req) => {
  const token = req.cookies.token;

  if(!token) {
    throw new Error("No token found");
  }

  const decoded = jwt.verify(
    token,
    process.env.TOKEN_KEY
  );

  return decoded.id;

};

//Get all threads
router.get("/thread", async (req, res) => {
    try {
        const userId = getUserId(req);

        const threads = await Thread.find({userId}).sort({ updatedAt: -1 });
        res.json(threads);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

//Get particular thread
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const userId = getUserId(req);

        const thread = await Thread.findOne({ threadID:threadId,
            userId
         });

        if (!thread) {
            res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

//Delete the chat 
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;  
    try {
        const userId = getUserId(req);

        const delThread = await Thread.findOneAndDelete({ threadID: threadId,userId, });

        if (!delThread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        return res.status(200).json({ success: "Thread deleted successfully" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to delete thread" });
    }
});


//Actual message route
router.post("/chat", async (req, res) => {
    const { threadID, message } = req.body;
    if (!threadID || !message) {
        return res.status(400).json({ error: "Missing required feild" });
    }

    try {

        const userId = getUserId(req);

        let thread = await Thread.findOne({ threadID,userId, });

        if (!thread) {
            //create a new thread
            thread = new Thread({
                userId,
                threadID,
                title: message,
                messages: [{ role: "user", content: message }],
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getGeminiAPIResponse(message);
        if (!assistantReply) {
            return res.status(500).json({
                error: "Failed to get AI response"
            });
        }

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();
        res.json({ reply: assistantReply });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});


export default router;