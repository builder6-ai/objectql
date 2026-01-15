#!/bin/bash
# Test script for pnpm-lock.yaml merge driver
# This script verifies that the merge driver is properly configured

set -e

echo "Testing pnpm-lock.yaml merge driver setup..."
echo ""

# Test 1: Check if .gitattributes exists and has correct content
echo "1. Checking .gitattributes..."
if [ ! -f ".gitattributes" ]; then
    echo "   ❌ FAIL: .gitattributes not found"
    exit 1
fi

if grep -q "pnpm-lock.yaml merge=pnpm-lock" .gitattributes; then
    echo "   ✓ PASS: .gitattributes correctly configured"
else
    echo "   ❌ FAIL: .gitattributes missing merge driver configuration"
    exit 1
fi

# Test 2: Check if merge scripts exist and are executable
echo "2. Checking merge scripts..."
if [ ! -x "scripts/merge-pnpm-lock.sh" ]; then
    echo "   ❌ FAIL: scripts/merge-pnpm-lock.sh not found or not executable"
    exit 1
fi

if [ ! -x "scripts/setup-merge-driver.sh" ]; then
    echo "   ❌ FAIL: scripts/setup-merge-driver.sh not found or not executable"
    exit 1
fi

echo "   ✓ PASS: All scripts exist and are executable"

# Test 3: Validate shell script syntax
echo "3. Validating shell script syntax..."
bash -n scripts/merge-pnpm-lock.sh && bash -n scripts/setup-merge-driver.sh
if [ $? -eq 0 ]; then
    echo "   ✓ PASS: Shell scripts have valid syntax"
else
    echo "   ❌ FAIL: Shell script syntax errors detected"
    exit 1
fi

# Test 4: Check if git config can be set (run setup script)
echo "4. Testing setup-merge-driver.sh..."
./scripts/setup-merge-driver.sh > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✓ PASS: Setup script executed successfully"
else
    echo "   ❌ FAIL: Setup script failed"
    exit 1
fi

# Test 5: Verify git config was set correctly
echo "5. Verifying git configuration..."
DRIVER_NAME=$(git config --get merge.pnpm-lock.name)
DRIVER_CMD=$(git config --get merge.pnpm-lock.driver)

if [ -z "$DRIVER_NAME" ] || [ -z "$DRIVER_CMD" ]; then
    echo "   ❌ FAIL: Git config not properly set"
    exit 1
fi

if [[ "$DRIVER_CMD" == *"merge-pnpm-lock.sh"* ]]; then
    echo "   ✓ PASS: Git merge driver configured correctly"
else
    echo "   ❌ FAIL: Git merge driver command incorrect"
    exit 1
fi

echo ""
echo "================================================"
echo "✓ All tests passed!"
echo "================================================"
echo ""
echo "The pnpm-lock.yaml merge driver is properly configured."
echo "It will automatically resolve merge conflicts in pnpm-lock.yaml."
