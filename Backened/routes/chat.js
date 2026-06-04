import express from 'express';
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from '../util/geminiai.js';

const router = express.Router();


router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadID: "abcd",
            title: "Testing the thread3"
        });

        const response = await thread.save();
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save in db" });
    }
});

//Get all threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
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
        const thread = await Thread.findOne({ threadID:threadId });

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
    const { threadId } = req.params;  // also fix naming mismatch
    try {
        const delThread = await Thread.findOneAndDelete({ threadID: threadId });

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
        let thread = await Thread.findOne({ threadID });

        if (!thread) {
            //create a new thread
            thread = new Thread({
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