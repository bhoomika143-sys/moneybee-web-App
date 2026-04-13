// 💰 MoneyBee Sample Notifications Data
let notifications = [
  {
    id: 1,
    type: "saving",
    title: "💰 Save Today!",
    message: "Add ₹50 to your savings and stay on track 🐝",
    time: "Just now"
  },
  {
    id: 2,
    type: "goal",
    title: "🎯 Goal Progress",
    message: "You’ve saved ₹800 out of ₹1000 for your Phone 📱",
    time: "30 min ago"
  },
  {
    id: 3,
    type: "reward",
    title: "🏆 Streak Unlocked",
    message: "7-day saving streak! Keep it going 🔥",
    time: "1 hr ago"
  },
  {
    id: 4,
    type: "alert",
    title: "📉 Spending Alert",
    message: "You spent ₹250 on snacks 🍔 today",
    time: "2 hrs ago"
  },
  {
    id: 5,
    type: "gold",
    title: "🪙 Gold Update",
    message: "Gold price increased by 1.2% today 📈",
    time: "Today"
  },
  {
    id: 6,
    type: "insurance",
    title: "🛡️ Insurance Tip",
    message: "Protect your phone with ₹99/month plan",
    time: "Today"
  },
  {
    id: 7,
    type: "saving",
    title: "💡 Smart Tip",
    message: "Skipping one coffee = ₹100 saved ☕➡️💰",
    time: "Yesterday"
  },
  {
    id: 8,
    type: "goal",
    title: "🚀 Almost There!",
    message: "90% of your Trip Fund completed 🌍",
    time: "Yesterday"
  },
  {
    id: 9,
    type: "reward",
    title: "🎉 Achievement",
    message: "You unlocked 'Budget Master' badge 🐝",
    time: "2 days ago"
  },
  {
    id: 10,
    type: "saving",
    title: "🔔 Reminder",
    message: "Weekly saving pending: ₹200",
    time: "3 days ago"
  }
];


// 🔄 Load Notifications
function loadNotifications() {
  const list = document.getElementById("notificationList");
  list.innerHTML = "";

  notifications.forEach(n => {
    const div = document.createElement("div");
    div.className = `notif-card ${n.type}`;

    div.innerHTML = `
      <h4>${n.title}</h4>
      <p>${n.message}</p>
      <span>${n.time}</span>
    `;

    list.appendChild(div);
  });
}


// 🧹 Clear All
function clearAll() {
  notifications = [];
  loadNotifications();
}


// 🔙 Back Button
function goBack() {
  window.history.back();
}


// 🚀 Auto Load
window.onload = loadNotifications;