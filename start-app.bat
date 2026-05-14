@echo off
echo Starting Expense Tracker Application...
echo.
echo Installing dependencies...
call npm run install-all

echo.
echo Starting backend and frontend servers...
call npm run app

pause
