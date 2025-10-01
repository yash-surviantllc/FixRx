#!/bin/bash

echo "🧹 Starting FixRx Repository Cleanup..."
echo ""

# Navigate to repository root
cd "$(dirname "$0")"

echo "📋 Step 1: Removing temporary documentation files..."
if [ -f "INTEGRATION_COMPLETE.md" ]; then
    git rm INTEGRATION_COMPLETE.md
    echo "✅ Removed INTEGRATION_COMPLETE.md"
fi

if [ -f "LOGIN_PROFILE_FIX_COMPLETE.md" ]; then
    git rm LOGIN_PROFILE_FIX_COMPLETE.md
    echo "✅ Removed LOGIN_PROFILE_FIX_COMPLETE.md"
fi

if [ -f "PROJECT_HANDOVER_COMPLETE.md" ]; then
    git rm PROJECT_HANDOVER_COMPLETE.md
    echo "✅ Removed PROJECT_HANDOVER_COMPLETE.md"
fi

if [ -f "TEST_INTEGRATION.md" ]; then
    git rm TEST_INTEGRATION.md
    echo "✅ Removed TEST_INTEGRATION.md"
fi

echo ""
echo "🧪 Step 2: Removing test scripts..."
if [ -f "quick-test.js" ]; then
    git rm quick-test.js
    echo "✅ Removed quick-test.js"
fi

if [ -f "simple-test.js" ]; then
    git rm simple-test.js
    echo "✅ Removed simple-test.js"
fi

echo ""
echo "🔍 Step 3: Checking for accidentally committed node_modules..."
if git ls-files | grep -q "node_modules"; then
    echo "⚠️  Found node_modules in git, removing..."
    git rm -r --cached node_modules 2>/dev/null || true
    git rm -r --cached frontend/node_modules 2>/dev/null || true
    git rm -r --cached backend/node_modules 2>/dev/null || true
    git rm -r --cached FixRxMobile/node_modules 2>/dev/null || true
    echo "✅ Removed node_modules from git tracking"
else
    echo "✅ No node_modules found in git (good!)"
fi

echo ""
echo "📊 Step 4: Repository status..."
git status

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Review the changes with: git status"
echo "2. Commit the cleanup: git commit -m 'chore: cleanup temporary files'"
echo "3. Add your vendor work: git add FixRxMobile/src/screens/vendor/"
echo "4. Commit your work: git commit -m 'feat: Add vendor dashboard and screens'"
echo "5. Push to GitHub: git push origin main"
echo ""
