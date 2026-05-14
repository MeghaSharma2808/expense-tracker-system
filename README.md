# Expense Tracker Application

A complete, production-ready expense tracking application built with React, Node.js, Express, and SQLite. Manage your income, expenses, budget, and analytics in a single, professional dashboard.

## 🎯 Features

### ✅ Complete & Fully Functional
- **User Authentication**: Secure registration, login, and logout with JWT
- **Dashboard**: Real-time analytics with income, expenses, balance, and recent transactions
- **Add Transactions**: Unified form for quick transaction entry
- **Transactions Management**: Search, filter, sort, paginate, edit, and delete transactions
- **Budget Management**: Set monthly budgets with overspending warnings
- **Analytics**: Professional charts for spending analysis by category and monthly trends
- **Profile Management**: Update profile information and change password
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📊 Visualizations
- Monthly Income vs Expense Line Chart
- Monthly Comparison Bar Chart
- Category Spending Pie Chart
- Budget Progress Bar
- Real-time Dashboard Cards

### 🔒 Security
- JWT-based authentication
- bcrypt password hashing
- Protected routes
- Secure API endpoints
- CORS enabled

### 💾 Database
- SQLite local database
- Automatic database initialization
- Proper data modeling with relationships
- No manual setup required

## 🏗️ Project Structure

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── transactionController.js
│   │   │   └── budgetController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Transaction.js
│   │   │   ├── Budget.js
│   │   │   └── index.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   └── budgetRoutes.js
│   │   └── server.js
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── AddTransactionPage.jsx
│   │   │   ├── TransactionsPage.jsx
│   │   │   ├── BudgetPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .gitignore
│   └── package.json
├── package.json
├── README.md
└── start-app.bat
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Windows/Mac/Linux

### Installation

#### Option 1: Quick Start (Windows)
Simply double-click the `start-app.bat` file to automatically install dependencies and start the application.

#### Option 2: Manual Installation

1. **Clone or Extract the project**
   ```bash
   cd expense-tracker
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the application**
   ```bash
   npm run app
   ```

This will start both backend and frontend servers simultaneously.

### 🔌 Ports
- **Frontend**: http://localhost:3000 (or next available port)
- **Backend**: http://localhost:5000

## 📱 Usage

### First Time Setup
1. Open http://localhost:3000 in your browser
2. Click "Register" to create a new account
3. Enter your name, email, and password
4. Click "Register" button
5. You'll be automatically logged in and redirected to the dashboard

### Logging In
1. Go to the login page
2. Enter your email and password
3. Click "Login" button

### Adding a Transaction
1. Click "Add Transaction" in the sidebar
2. Fill in the transaction details:
   - Amount (required)
   - Type: Income or Expense
   - Category (auto-filled based on type)
   - Date
   - Payment Method: Cash, UPI, Card, Bank Transfer
   - Description (optional)
   - Notes (optional)
3. Click "Save Transaction" button

### Viewing Transactions
1. Click "Transactions" in the sidebar
2. Use filters to narrow down results:
   - Search by description or category
   - Filter by type (Income/Expense)
   - Filter by category
   - Adjust items per page
3. Edit or delete transactions using the action buttons
4. Use pagination to navigate through pages

### Setting a Budget
1. Click "Budget" in the sidebar
2. Click "Set Budget" button
3. Enter your monthly budget amount
4. Click "Save Budget"
5. Monitor your spending progress with the visual progress bar
6. Get warned if you exceed your budget

### Viewing Analytics
1. Click "Analytics" in the sidebar
2. View detailed charts:
   - Monthly Income vs Expense trends
   - Category spending breakdown (pie chart)
   - Monthly comparison (bar chart)
3. See summary statistics for total income, expense, and savings

### Managing Profile
1. Click "Profile" in the sidebar
2. Click "Edit Profile" to update name or email
3. Click "Change Password" to update your password
4. Click "Logout" to sign out

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get all transactions (with pagination)
- `GET /api/transactions/:id` - Get specific transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/dashboard-data` - Get dashboard data
- `GET /api/transactions/analytics-data` - Get analytics data

### Budget
- `POST /api/budget` - Set/update budget
- `GET /api/budget` - Get current budget
- `DELETE /api/budget/:id` - Delete budget

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Recharts** - Charts and analytics
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework
- **Sequelize** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

## 📊 Database Schema

### Users Table
```
id (PK)
name
email (Unique)
password (hashed)
createdAt
updatedAt
```

### Transactions Table
```
id (PK)
userId (FK)
amount
type (income/expense)
category
date
paymentMethod (cash/upi/card/bank_transfer)
description
notes
createdAt
updatedAt
```

### Budget Table
```
id (PK)
userId (FK)
monthYear (YYYY-MM)
amount
createdAt
updatedAt
```

## 🔐 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: bcryptjs with salt rounds
3. **Protected Routes**: Frontend routes protected with authentication checks
4. **API Security**: All endpoints require valid JWT token
5. **CORS Enabled**: Proper cross-origin resource sharing
6. **Input Validation**: Server-side validation for all inputs
7. **Error Handling**: Graceful error handling with proper messages

## 📈 Performance Optimizations

1. **Pagination**: Transactions loaded with pagination (10/20/50 per page)
2. **API Caching**: Local state management for dashboard data
3. **Lazy Loading**: Components loaded on demand
4. **Responsive Images**: Optimized assets
5. **Code Splitting**: Vite handles automatic code splitting

## 🧪 Testing the Application

### Test Credentials
You can use any credentials to register a new account for testing.

### Test Scenarios
1. Register → Login → Dashboard
2. Add Transaction → See it in Dashboard
3. Add Multiple Transactions → Filter and Search
4. Set Budget → Check Progress Bar
5. View Analytics → See Charts Update
6. Change Profile → Update Password
7. Logout → Login Again

### Data Verification
- All data persists in `expense_tracker.sqlite` database
- Database auto-creates on first backend start
- Check tables using any SQLite viewer

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Build the frontend
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy to Vercel:
   ```bash
   npm i -g vercel
   vercel
   ```
3. Update API base URL in `src/services/api.js` to your backend URL

### Backend Deployment (Render/Railway)

#### Using Render:
1. Push code to GitHub
2. Connect GitHub repo to Render
3. Create new Web Service
4. Set build command: `cd backend && npm install`
5. Set start command: `npm start`
6. Set environment variables
7. Deploy

#### Using Railway:
1. Connect GitHub repo to Railway
2. Create new project
3. Deploy backend folder
4. Set start command
5. Update frontend API URL

### Environment Variables (Backend)
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secret-key
```

## 📝 Notes

- Database file `expense_tracker.sqlite` is created automatically in the project root
- All data is stored locally in SQLite
- No cloud database required
- Complete database synchronization on backend startup
- All dependencies use stable, verified versions

## 🐛 Troubleshooting

### Backend won't start
1. Check if port 5000 is available
2. Delete `expense_tracker.sqlite` and restart
3. Check Node.js version (should be v14+)

### Frontend won't load
1. Check if port 3000 is available
2. Clear browser cache
3. Check API URL in `src/services/api.js`

### Transactions not showing
1. Check backend is running on port 5000
2. Verify JWT token in localStorage
3. Check browser console for errors

### Build fails
1. Delete `node_modules` folders
2. Delete `package-lock.json`
3. Run `npm install` again

## 📧 Support

For issues or questions, please check the code structure and documentation in each component file.

## 📄 License

This project is provided as-is for educational and commercial purposes.

---

**Version**: 1.0.0  
**Last Updated**: 2026  
**Status**: ✅ Production Ready
