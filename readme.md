# 🌟 **Smart HR - Revolutionizing Workforce Management** 🌟

Smart HR is an innovative solution designed to streamline and enhance human resource management processes. With features tailored for modern organizations, it simplifies hiring, employee management, payroll, offboarding, and more. 💼📊

## 📄 Contents

- `report.pdf` – Comprehensive project report detailing the objective, methodology, implementation, and results.
- `presentation.pptx` – Slide presentation summarizing the project's key points for quick understanding and sharing.

---

## 🎯 **Key Features**
- 📝 **Employee Management**: Centralized employee records with easy access and updates.
- 🔄 **Onboarding & Offboarding**: Smooth employee transitions with automated workflows.
- 💰 **Payroll and Compensation**: Simplified salary processing and tax calculations.
- 📊 **Performance Management**: Monitor and evaluate employee performance seamlessly.
- 📅 **Training and Development**: Track employee training and skill development programs.
- 📈 **Leave Management**: Effortless leave application, approval, and tracking.
- 🔔 **Notifications**: Alerts for important tasks, deadlines, and updates.
- ⚖️ **Compliance and Policies**: Ensure the organization adheres to legal and internal policies.
- 🏥 **Benefits and Welfare**: Manage employee benefits like insurance and health plans.
- 🚪 **Exit Management**: Manage the exit process when employees leave the organization.

---

## 🛠️ **Technologies Used**
- ⚙️ **Frontend**: HTML, CSS, JavaScript, EJS
- 💻 **Backend**: Node.js (Express.js)
- 💾 **Database**: MySQL
- 🔐 **Authentication**: Employee ID and password-based login
- 🌐 **Hosting**: Local server (XAMPP, WAMP)

---

## 🚀 **Installation and Setup**
Follow these steps to get **Smart HR** running on your local machine:

### 1️⃣ **Clone the Repository**
Open a terminal and run:
```bash
git clone https://github.com/yourusername/SmartHR.git
cd SmartHR
```

### 2️⃣ **Install Dependencies**
Run the following command to install required packages:
```bash
npm install
```

### 3️⃣ **Configure Database**
- **Create a MySQL database** and import the required tables.
- **Rename `.env.example` to `.env`** and update the database credentials:
  ```env
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=yourpassword
  DB_NAME=smarthr
  ```

### 4️⃣ **Run Database Migrations (If Any)**
manually import the `hr_management.sql` database file.

### 5️⃣ **Run the Project**
Start the server:
```bash
npm start
```
Your project will be running at:  
📌 **http://localhost:3000**

---

## 🛠 **Development Mode**
To run in development mode with **nodemon**:
```bash
npm run dev
```
This will auto-restart the server on file changes.

---

