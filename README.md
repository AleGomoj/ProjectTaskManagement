![logo](https://res.cloudinary.com/dczjloaiy/image/upload/v1749029804/TaskFlow_logotipo_para_mi_web_colores_pastel_azules_y_morados_1_dwaels.jpg)

# **TaskFlow** ✅

**TaskFlow** is a task management application built to help teams and individuals track tasks efficiently. With a responsive React frontend, a robust Node.js/Express backend, and a MySQL database, **TaskFlow** offers a reliable solution for managing your workflow from start to finish. Whether you're organizing personal projects or collaborating in a team, **TaskFlow** is designed to boost productivity and clarity.

---

## 📌 **Table of Contents**
1. [⚙️ Installation and Requirements](#installation-and-requirements)
2. [🎨 App Design](#-app-design)
3. [🏗️ Project Architecture](#project-architecture)
4. [💻 Technologies Used](#-technologies-used) 
5. [📚 Libraries](#-libraries)
6. [🧪 Test Screenshots](#-test-screenshots)
7. [🚀 Next Steps](#-next-steps)
8. [🌐 Preview](#-preview)
9. [🔖 License](#-license)

---

## ⚙️ Installation and Requirements <a name="installation-and-requirements"></a>

### **Prerequisites**  
>[!IMPORTANT]  
Before starting, ensure the following are installed:
- **Node.js** (v18 or higher recommended) → [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MySQL** (you can use [XAMPP](https://www.apachefriends.org/index.html))

### **Installation Steps**

1. **Clone the repository**
```bash
git clone https://github.com/AleGomoj/TaskFlow
cd TaskFlow
```

2. **Install dependencies**
```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
```

3. **Configure the database**
- Open **XAMPP** and start MySQL
- Open **phpMyAdmin**
- Import `ScriptSQL.txt` to create the database
- Ask [@AleGomoj](https://github.com/AleGomoj) for the `.env` file with credentials

4. **Run the application**

**Windows:**
```bash
./start-apps.bat
```
This will open two terminals:
- Backend → `http://localhost:4000`
- Frontend → `http://localhost:3000`

**Linux/macOS:**
```bash
./start-apps.sh
```

## 🎨 **App Design**

### 🖥️ Desktop Screens

| Dashboard | Tasks | Task Detail |
|----------|-------|-------------|
| *(Coming soon)* | *(Coming soon)* | *(Coming soon)* |

### 📱 Mobile Screens

| Dashboard | Tasks | Task Detail |
|----------|-------|-------------|
| *(Coming soon)* | *(Coming soon)* | *(Coming soon)* |

---

## 🏗️ Project Architecture <a name="project-architecture"></a>

📂 ProjectTaskManagement  
├─ 📂 backend  
│ ├─ app.js  
│ ├─ 📂 controllers  
│ ├─ 📂 models  
│ ├─ 📂 routes  
│ ├─ 📄 .env  
│ └─ 📄 package.json  
├─ 📂 frontend  
│ ├─ 📂 src  
│ │ ├─ 📂 components  
│ │ ├─ 📂 pages  
│ │ ├─ 📂 context  
│ │ └─ main.jsx  
│ └─ 📄 package.json  
├─ 📄 ScriptSQL.txt  
├─ 📄 start-apps.bat  
├─ 📄 start-apps.sh  
└─ 📄 README.md

---

## 💻 **Technologies Used**
- **React** – Frontend JavaScript library for building user interfaces
- **Node.js** – Backend runtime environment
- **Express.js** – Web framework for Node.js
- **MySQL** – Relational database system

---

## 📚 **Libraries**
- express
- mysql2
- dotenv
- cors
- nodemon
- react
- react-dom
- react-router-dom
- axios

---

## 🧪 **Test Screenshots**

| Test Case               | Screenshot |
|-------------------------|------------|
| **Frontend Coverage**   | *![test frontend](https://github.com/user-attachments/assets/d043b3aa-5551-4830-80be-c1732c374c77)* |
| **Backend Coverage**    | *![test backend](https://github.com/user-attachments/assets/d266b2e3-02c3-4018-8a9f-02bcf566912d)* |

---

## 🚀 **Next Steps**
- Export tasks as PDF or CSV
- Share boards with other users.

---

## 🌐 **Preview**
Coming soon

---

## 🔖 **License**
TaskFlow is licensed under the [MIT License](https://opensource.org/licenses/MIT).
