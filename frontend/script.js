
const API_URL = 'http://localhost:3001/api';

// 1. Fetch and Display Activities on Load
document.addEventListener('DOMContentLoaded', () => {
    loadActivities();
});

// 2. Handle Form Submission
document.getElementById('fitnessForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop page reload

    const activity = {
        activity: document.getElementById('activity').value,
        duration: parseInt(document.getElementById('duration').value),
        calories: parseInt(document.getElementById('calories').value),
        notes: document.getElementById('notes').value
    };

    try {
        const response = await fetch(`${API_URL}/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activity)
        });

        if (response.ok) {
            alert("Activity Logged! ✅");
            document.getElementById('fitnessForm').reset();
            loadActivities(); // Refresh list
        }
    } catch (error) {
        console.error("Error logging activity:", error);
    }
});

// 3. Function to Load Activities
async function loadActivities() {
    try {
        const response = await fetch(`${API_URL}/activities`);
        const activities = await response.json();

        const listContainer = document.getElementById('activityList');
        listContainer.innerHTML = ''; // Clear current list

        activities.forEach(log => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            
            // Format date slightly
            const dateObj = new Date(log.date).toLocaleDateString();

            item.innerHTML = `
                <div class="activity-info">
                    <h4>${log.activity}</h4>
                    <span>${log.notes || "No notes"} • ${dateObj}</span>
                </div>
                <div class="activity-meta">
                    ${log.duration} min<br>
                    ${log.calories} kcal
                </div>
            `;
            listContainer.appendChild(item);
        });
    } catch (error) {
        console.error("Error loading list:", error);
    }
}

// 4. Fetch AI Insight
async function fetchAIInsight() {
    const resultBox = document.getElementById('aiResult');
    resultBox.innerHTML = "Analyzing data...";

    try {
        const response = await fetch(`${API_URL}/ai-insight`);
        const data = await response.json();

        resultBox.innerHTML = `
            <strong>📊 Summary:</strong> ${data.summary} <br><br>
            <strong>💡 AI Tip:</strong> ${data.insight}
        `;
    } catch (error) {
        resultBox.innerHTML = "Error generating insight.";
    }
}