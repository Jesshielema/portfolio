@echo off
echo 🚀 Uploading portfolio to GitHub...

REM Add all changes
git add .

REM Check if there are changes to commit
git diff --cached --quiet
if %errorlevel% neq 0 (
    echo 📝 Changes detected, committing...
    git commit -m "Update portfolio - %date% %time%"
    
    echo 🌐 Pushing to GitHub...
    git push origin main
    
    if %errorlevel% equ 0 (
        echo ✅ Portfolio successfully uploaded!
        echo 🌐 Your site should update automatically if using GitHub Pages/Netlify
    ) else (
        echo ❌ Push failed. Check your internet connection and credentials.
    )
) else (
    echo ℹ️ No changes to upload
)

pause
