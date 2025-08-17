# 🚜 QR Management for Tractors (MERN Stack)

A complete **QR-based Tractor Management System** built using the **MERN Stack**.  
Admins can add tractor details and generate unique QR codes that can be stuck on tractors.  
When scanned, the QR reveals tractor details like owner info, model, and service history.

## 📂 Project Structure

📦 qr-tractor-management
┣ 📂 backend # Node.js + Express (APIs, MongoDB, QR Generation)
┣ 📂 frontend # React.js (Admin Dashboard & QR Scan UI)
┣ 📜 README.md
┗ 📜 package.json

## ⚙️ Tech Stack

- **Frontend** → React.js (Admin Dashboard + UI)  
- **Backend** → Node.js + Express.js (REST APIs + QR Generation)  
- **Database** → MongoDB (Tractor details, service history, ownership)  
- **Other** → `qrcode` npm package  

---

## 🚀 Features

- **Admin Panel**
  - Add, update, delete tractor details  
  - Generate & download QR codes  

- **QR Integration**
  - Unique QR per tractor  
  - QR redirects to tractor detail page  

- **User Side**
  - Scan QR → View tractor details instantly  
  - See service history & ownership records  

---

## 🛠️ Installation & Setup

### 1. Clone the Repo
```bash
git clone https://github.com/adityaehhhh/Escorts-Summer-Internship
cd qr-tractor-management
```

### 2. Start The Backend
```bash
cd backend
npm install
npm run dev
Runs at: http://localhost:5000
```

### 3. Start The Frontend
```bash
cd ../frontend
npm install
npm start
Runs at: http://localhost:3000
```
