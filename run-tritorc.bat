@echo off
echo.
echo ========================================
echo   Starting Tritorc App Dev Server
echo ========================================
echo.

REM Navigate to the project folder
cd /D "C:\Users\GU123\Downloads\tritorc-proto-v1-main"

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Start the dev server
echo Starting dev server...
echo Open your browser to: http://localhost:3000
echo.
call npm run dev

pause
