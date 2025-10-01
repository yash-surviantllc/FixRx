@echo off
echo.
echo ========================================
echo    FixRx Repository Cleanup Script
echo ========================================
echo.

cd /d "%~dp0"

echo [Step 1] Removing temporary documentation files...
if exist "INTEGRATION_COMPLETE.md" (
    git rm INTEGRATION_COMPLETE.md
    echo [OK] Removed INTEGRATION_COMPLETE.md
)

if exist "LOGIN_PROFILE_FIX_COMPLETE.md" (
    git rm LOGIN_PROFILE_FIX_COMPLETE.md
    echo [OK] Removed LOGIN_PROFILE_FIX_COMPLETE.md
)

if exist "PROJECT_HANDOVER_COMPLETE.md" (
    git rm PROJECT_HANDOVER_COMPLETE.md
    echo [OK] Removed PROJECT_HANDOVER_COMPLETE.md
)

if exist "TEST_INTEGRATION.md" (
    git rm TEST_INTEGRATION.md
    echo [OK] Removed TEST_INTEGRATION.md
)

echo.
echo [Step 2] Removing test scripts...
if exist "quick-test.js" (
    git rm quick-test.js
    echo [OK] Removed quick-test.js
)

if exist "simple-test.js" (
    git rm simple-test.js
    echo [OK] Removed simple-test.js
)

echo.
echo [Step 3] Checking for accidentally committed node_modules...
git ls-files | findstr /C:"node_modules" >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Found node_modules in git, removing...
    git rm -r --cached node_modules 2>nul
    git rm -r --cached frontend\node_modules 2>nul
    git rm -r --cached backend\node_modules 2>nul
    git rm -r --cached FixRxMobile\node_modules 2>nul
    echo [OK] Removed node_modules from git tracking
) else (
    echo [OK] No node_modules found in git (good!)
)

echo.
echo [Step 4] Repository status...
git status

echo.
echo ========================================
echo    Cleanup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Review changes: git status
echo 2. Commit cleanup: git commit -m "chore: cleanup temporary files"
echo 3. Add vendor work: git add FixRxMobile/src/screens/vendor/
echo 4. Commit work: git commit -m "feat: Add vendor dashboard and screens"
echo 5. Push to GitHub: git push origin main
echo.
pause
