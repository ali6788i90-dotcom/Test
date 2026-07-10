// State Management
let userPoints = 100;
let availableTasks = [
    { id: 1, title: "Translate API Docs", desc: "Translate 3 markdown pages from English to Spanish.", reward: 25 },
    { id: 2, title: "Fix UI Alignment", desc: "Align CSS grid items properly in the dashboard layout.", reward: 15 }
];
let claimedTasks = [];

// DOM Elements
const userPointsEl = document.getElementById("user-points");
const taskForm = document.getElementById("task-form");
const availableListEl = document.getElementById("available-tasks-list");
const claimedListEl = document.getElementById("claimed-tasks-list");

// Initialize Data on Launch
function init() {
    renderBoards();
}

// Render Content dynamically
function renderBoards() {
    userPointsEl.textContent = userPoints;
    
    // Clear lists
    availableListEl.innerHTML = "";
    claimedListEl.innerHTML = "";

    // Populate Available List
    if (availableTasks.length === 0) {
        availableListEl.innerHTML = '<p class="task-desc">No tasks posted yet.</p>';
    } else {
        availableTasks.forEach(task => {
            availableListEl.appendChild(createTaskCard(task, false));
        });
    }

    // Populate Claimed List
    if (claimedTasks.length === 0) {
        claimedListEl.innerHTML = '<p class="task-desc">You haven\'t claimed any tasks.</p>';
    } else {
        claimedTasks.forEach(task => {
            claimedListEl.appendChild(createTaskCard(task, true));
        });
    }
}

// Helper to generate Card DOM Element
function createTaskCard(task, isClaimed) {
    const card = document.createElement("div");
    card.className = "task-card";

    if (!isClaimed) {
        card.innerHTML = `
            <div class="task-header">
                <span class="task-title">${task.title}</span>
                <span class="task-reward">+${task.reward} Pts</span>
            </div>
            <p class="task-desc">${task.desc}</p>
            <div class="task-actions">
                <button class="btn-action btn-claim" onclick="claimTask(${task.id})">Claim Task</button>
            </div>
        `;
    } else {
        card.innerHTML = `
            <div class="task-header">
                <span class="task-title">${task.title}</span>
                <span class="task-reward">+${task.reward} Pts</span>
            </div>
            <p class="task-desc">${task.desc}</p>
            <div class="task-actions">
                <button class="btn-action btn-complete" onclick="completeTask(${task.id})">Complete</button>
                <button class="btn-action btn-cancel" onclick="cancelTask(${task.id})">Drop</button>
            </div>
        `;
    }
    return card;
}

// Form Submission Event Listener
taskForm.addEventListener("submit", function(e) {
    e.preventDefault(); // Stop page reload
    
    const title = document.getElementById("task-title").value;
    const desc = document.getElementById("task-desc").value;
    const reward = parseInt(document.getElementById("task-reward").value);

    // Security Check: Ensure user has points to host a task reward
    if (userPoints < reward) {
        alert("Inadequate balance to fund this task reward!");
        return;
    }

    // Deduct cost and save
    userPoints -= reward;
    const newTask = { id: Date.now(), title, desc, reward };
    availableTasks.push(newTask);
    
    taskForm.reset();
    renderBoards();
});

// Exchange Operations
window.claimTask = function(id) {
    const taskIndex = availableTasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
        const [task] = availableTasks.splice(taskIndex, 1);
        claimedTasks.push(task);
        renderBoards();
    }
};

window.cancelTask = function(id) {
    const taskIndex = claimedTasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
        const [task] = claimedTasks.splice(taskIndex, 1);
        availableTasks.push(task);
        renderBoards();
    }
};

window.completeTask = function(id) {
    const taskIndex = claimedTasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
        const [task] = claimedTasks.splice(taskIndex, 1);
        userPoints += task.reward; // Collect payout
        alert(`Task Completed! You earned ${task.reward} points.`);
        renderBoards();
    }
};

// Start App
init();

