MIS Invoicing System  
Developer: Yogini Girigosavi  
Course: Master in java full stack development 
Date: May 2025  

1. Project Overview  
The **MIS Invoicing System** is a web-based application designed to streamline billing and invoice management for small and medium businesses. It allows users to:  
- Create, manage, and send professional invoices.  
- Track payments and overdue invoices.  
- Generate financial reports (PDF/Excel).  
- Manage clients and products/services efficiently.  

Target Users: Business owners, accountants, and sales teams.  

2. Technologies Used  

Frontend:  
- HTML5, CSS3, Bootstrap 5 (Responsive UI)  
- JavaScript (Dynamic Client-Side Logic)  
- React.js (Frontend Framework)  

Backend:
- Node.js (Runtime Environment)  
- Express.js (Backend Framework)  

Database: 
- MongoDB (NoSQL Database for flexible data storage)  

Tools & Platforms:  
- Git & GitHub (Version Control)  
- Postman (API Testing)  
- VS Code (Development IDE)  

3. Installation & Setup 
Prerequisites: 
- Node.js (v16+) installed  
- MongoDB Atlas (Cloud) or Local MongoDB setup  
- Git (for cloning the repository)  

Steps to Run the Project: 

1. Clone the repository: 
   ```bash
   git clone https://github.com/[your-username]/mis-invoicing-system.git
   cd mis-invoicing-system
   ```

2. Install dependencies (Frontend & Backend):  
   ```bash
   cd client && npm install   # Frontend (React)
   cd ../server && npm install  # Backend (Node.js/Express)
   ```

3. Set up environment variables:  
   - Create a `.env` file in `/server` and add:  
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     ```

4. Run the application:  
   - Backend (Node.js):  
     ```bash
     cd server && npm start
     ```
   - Frontend (React):  
     ```bash
     cd client && npm start
     ```

5. Access the application: 
   - Frontend: `http://localhost:5173`  
   - Backend API: `http://localhost:5000`  

4. Key Features (Some features are under development)
   User Authentication– Secure login/signup with JWT.  
   Invoice Management – Create, edit, delete, and send invoices.  
   Client & Product Management** – Store client details and product catalogs.  
   Payment Tracking – Mark invoices as paid/unpaid with due dates.  
   Report Generation – Export invoices & financial data in PDF/Excel.  
   Dashboard Analytics – Visualize sales trends and revenue.  

Developed by Yogini Girigosavi 
📧 Contact: yoginigosavi1005@gmail.com
🔗 GitHub: https://github.com/yogini-1005/MIS-Invoicing-System
 
