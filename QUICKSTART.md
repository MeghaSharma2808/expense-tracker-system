# 🚀 QUICKSTART GUIDE

## ⚡ 30-Second Setup (Windows)

### Option 1: Automatic (Recommended)
1. Open folder: `c:\Users\hp\OneDrive\Desktop\Expense Tracker System`
2. **Double-click** `start-app.bat`
3. Wait for installation to complete
4. Open browser: **http://localhost:3001**
5. Register → Login → Start tracking expenses!

### Option 2: Manual
```bash
cd "c:\Users\hp\OneDrive\Desktop\Expense Tracker System"
npm run install-all
npm run app
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000

## 👤 Test Account (Already Created)
- **Email**: john@test.com
- **Password**: password123
- **Has Data**: Yes (1 transaction, 1 budget)

Or register a new account:
1. Click "Register"
2. Enter Name, Email, Password
3. Click "Register"
4. Automatically logged in!

## 📋 Main Features

### Dashboard
- View income, expenses, balance
- See recent transactions
- Monthly spending breakdown
- Charts (Line, Bar, Pie)

### Add Transaction
- Amount, Type (Income/Expense)
- Category, Date, Payment Method
- Description & Notes
- Save → Dashboard updates automatically

### Transactions
- View all transactions
- Search by description/category
- Filter by type or category
- Edit or delete
- Pagination (10/20/50 per page)

### Budget
- Set monthly budget
- Track spending vs budget
- Progress bar
- Overspending warning

### Analytics
- Income vs Expense trends
- Category spending pie chart
- Monthly comparison
- Summary statistics

### Profile
- View user info
- Edit name/email
- Change password
- Logout

## 🔌 Ports & Services

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Backend | 5000 | http://localhost:5000 | Running ✅ |
| Frontend | 3001 | http://localhost:3001 | Running ✅ |
| Database | Local | expense_tracker.sqlite | Created ✅ |

## 📁 Project Structure

```
Expense Tracker System/
├── backend/                 # Node.js + Express API
├── frontend/               # React + Vite
├── package.json            # Root dependencies
├── README.md               # Full documentation
├── DEPLOYMENT_TESTING_GUIDE.md
├── QUICKSTART.md           # This file
└── start-app.bat          # Windows launcher
```

## 🛠️ Common Commands

```bash
# Install all dependencies
npm run install-all

# Start both servers
npm run app

# Start only backend
cd backend
npm start

# Start only frontend
cd frontend
npm run dev

# Build frontend for production
cd frontend
npm run build

# View production build
cd frontend
npm run preview
```

## 🆘 If Something Goes Wrong

### Issue: Port already in use
```bash
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# For port 3001
netstat -ano | findstr :3001
```

### Issue: Dependencies not installed
```bash
# Delete node_modules and reinstall
rmdir /s /q node_modules
npm install

# For backend
cd backend
rmdir /s /q node_modules
npm install

# For frontend
cd frontend
rmdir /s /q node_modules
npm install
```

### Issue: Database corrupted
```bash
# Delete database file, it will recreate on next start
del expense_tracker.sqlite
```

### Issue: Still not working?
1. Close all terminal windows
2. Delete `node_modules` folders
3. Delete `package-lock.json` files
4. Run `npm run install-all`
5. Run `npm run app`

## 📱 Mobile Access

1. Open **Developer Tools** (F12 in Chrome)
2. Toggle **Device Toolbar** (Ctrl+Shift+M)
3. Test responsive design
4. Or access from another device on same network:
   - Note your PC IP: `ipconfig` (look for IPv4)
   - Access from phone: `http://<your-ip>:3001`

## 🎨 Customize

### Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: '#3B82F6',      // Change this
  secondary: '#10B981',
  danger: '#EF4444',
  // ...
}
```

### Company Name
Search and replace "ExpenseTracker" in all files with your name.

### Currency
Edit `frontend/src/utils/helpers.js`:
```javascript
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {  // Change locale
    style: 'currency',
    currency: 'INR',  // Change currency code
  }).format(amount);
};
```

## 🔐 Security Notes

- **Default JWT Secret**: Change in production
- **Passwords**: Hashed with bcryptjs (salt rounds: 10)
- **Token Duration**: 7 days
- **Database**: SQLite (local only)

For production deployment, update:
- `backend/src/middleware/auth.js` - Change JWT_SECRET
- Environment variables for sensitive data
- Use HTTPS for all connections

## 📦 What's Installed

### Backend
- Express.js - Web server
- Sequelize - ORM
- SQLite - Database
- JWT - Authentication
- bcryptjs - Password hashing
- CORS - Cross-origin requests

### Frontend
- React 18 - UI framework
- Vite - Build tool
- Tailwind CSS - Styling
- Recharts - Charts
- React Router - Navigation
- Axios - HTTP client

## 🚀 Deploy to Cloud

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Upload dist folder to Vercel/Netlify
```

### Backend (Render/Railway/Heroku)
- Push to GitHub
- Connect GitHub repo
- Auto-deploys on push
- See DEPLOYMENT_TESTING_GUIDE.md for details

## 📊 Database Schema

```
Users
├── id (Primary Key)
├── name
├── email (Unique)
├── password (hashed)
└── timestamps

Transactions
├── id (Primary Key)
├── userId (Foreign Key)
├── amount
├── type (income/expense)
├── category
├── date
├── paymentMethod
├── description
├── notes
└── timestamps

Budgets
├── id (Primary Key)
├── userId (Foreign Key)
├── monthYear (YYYY-MM)
├── amount
└── timestamps
```

## 📞 Quick Reference

**First Time?**
1. Run `start-app.bat`
2. Open browser to http://localhost:3001
3. Click "Register"
4. Create account
5. Start adding transactions

**Returning User?**
1. Run `start-app.bat`
2. Open browser to http://localhost:3001
3. Click "Login"
4. Use credentials
5. All data is saved!

**Development?**
1. Open 2 terminals
2. Terminal 1: `cd backend && npm start`
3. Terminal 2: `cd frontend && npm run dev`
4. Edit code, changes auto-reload

**Production?**
- See DEPLOYMENT_TESTING_GUIDE.md
- Build: `npm run build`
- Deploy to Vercel/Render
- Update API URL in config

## ✅ Everything Working?

- ✅ Backend runs on port 5000
- ✅ Frontend runs on port 3001
- ✅ Database creates automatically
- ✅ Can register new users
- ✅ Can login with credentials
- ✅ Can add transactions
- ✅ Dashboard updates automatically
- ✅ Charts display correctly
- ✅ Can set budget
- ✅ Can view analytics
- ✅ Profile page loads
- ✅ Logout works
- ✅ Can login again

**If all ✅, you're ready to go!**

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: May 14, 2026

For detailed information, see README.md and DEPLOYMENT_TESTING_GUIDE.md
