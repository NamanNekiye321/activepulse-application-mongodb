const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const PORT = 3001;

// 1. Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(bodyParser.json());

// 2. MongoDB Connection
const MONGO_URI = "mongodb+srv://aitr:naman321nekiye@cluster0.7mcpqaw.mongodb.net/active_pulse_db?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 3. Define Schema (Structure)
const ActivitySchema = new mongoose.Schema({
    activity: String,
    duration: Number, // in minutes
    calories: Number,
    notes: String,
    date: { type: Date, default: Date.now }
});

const Activity = mongoose.model('FitnessLog', ActivitySchema);

// 4. API Routes

// Route A: Add Activity
app.post('/api/activities', async (req, res) => {
    try {
        const newActivity = new Activity(req.body);
        const savedActivity = await newActivity.save();
        res.status(201).json(savedActivity);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route B: Get All Activities
app.get('/api/activities', async (req, res) => {
    try {
        // Sort by date descending (newest first)
        const activities = await Activity.find().sort({ date: -1 });
        res.json(activities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route C: Generate AI Insight (Rule-Based Logic)
app.get('/api/ai-insight', async (req, res) => {
    try {
        const activities = await Activity.find();
        
        let totalCalories = 0;
        let totalDuration = 0;
        let activityTypes = {};

        activities.forEach(log => {
            totalCalories += log.calories;
            totalDuration += log.duration;
            activityTypes[log.activity] = (activityTypes[log.activity] || 0) + 1;
        });

        // "AI" Logic: Determine feedback based on data analysis
        let aiMessage = "";
        
        if (activities.length === 0) {
            aiMessage = "I don't see any data yet. Start logging to get AI insights!";
        } else if (totalCalories > 2000) {
            aiMessage = "🔥 Incredible work! You've burned over 2000 calories recently. Your metabolism is on fire. Consider a high-protein recovery meal.";
        } else if (totalDuration > 120) {
            aiMessage = "⚡ You've clocked over 2 hours of activity. Consistency is key! Make sure you stay hydrated.";
        } else {
            aiMessage = "💪 Good start! Try to increase your duration by 10 minutes next session to boost endurance.";
        }

        res.json({ 
            summary: `Total Logs: ${activities.length} | Total Burn: ${totalCalories} kcal`,
            insight: aiMessage 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});