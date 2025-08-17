# 🔔 Centralized Notification System (PERN Stack)

A **centralized notification service** (just like Firebase for notifications) built with the **PERN Stack**.  
Developers can integrate this service into their applications using an **API Key** to send, manage, and deliver notifications in real-time.  

## 📂 Project Structure

📦 centralized-notification-system  
┣ 📂 backend # Node.js + Express + PostgreSQL (Notification APIs, Auth, API Key validation)  
┣ 📂 frontend # React.js (Sample App Dashboard & Notification UI)  
┣ 📂 database # PostgreSQL schemas & migrations  
┣ 📜 README.md  
┗ 📜 package.json  

---

## ⚙️ Tech Stack

- **Frontend** → React.js (Sample App + Notification UI)  
- **Backend** → Node.js + Express.js (REST APIs)  
- **Database** → PostgreSQL (Store notifications, API keys, user data)  
- **Realtime** → WebSockets / SSE for live updates  

---

## 🚀 Features

- **API Key Based Access**  
  - Generate unique API keys per app  
  - Secure notification delivery  

- **Notification Management**  
  - Send, update, and delete notifications  
  - Schedule notifications  

- **Delivery Channels**  
  - In-app notifications  
  - Email (optional integration)  

- **Developer Friendly**  
  - REST API endpoints for sending & fetching notifications  
  - Sample React app for quick integration  

---

## 🛠️ Installation & Setup

### 1. Clone the Repo
git clone https://github.com/adityaehhhh/Escorts-Summer-Internship
cd centralized-notification-system

### 2. Start The Backend
cd backend
npm install
node server.js
node worker.js
Runs at: http://localhost:5000

### 3. Start The Frontend (Backend Dev Dashboard + Sample App)
cd frontend
npm install
npm start
Runs at: http://localhost:3000


### 📱 Sample App
The frontend sample app demonstrates:
Fetching user notifications
Displaying real-time updates
Sending test notifications with your API key

### ✅ Roadmap
 Push Notifications (Browser + Mobile)
 Email/SMS integration
 Admin Panel for API Key Management
 Analytics Dashboard for notification delivery
