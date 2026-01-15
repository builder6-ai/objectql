# pnpm-lock.yaml Conflict Prevention

This directory contains automated workflows to prevent and resolve `pnpm-lock.yaml` merge conflicts.

## Problem

When multiple developers work on different branches and modify dependencies, merging branches often results in conflicts in `pnpm-lock.yaml`. This file is auto-generated and difficult to resolve manually, leading to:

- Wasted time resolving conflicts
- Potential dependency inconsistencies
- Failed CI/CD pipelines
- Developer frustration

## Solution

We've implemented a multi-layered approach to prevent and automatically resolve lockfile conflicts:

### Layer 1: Version Consistency

**What:** Enforce consistent pnpm version across all environments.

**How:** 
- Added `engines` field in `package.json` requiring pnpm 9.x
- All GitHub Actions workflows use pnpm version 9
- Lockfile format version is 9.0

**Why:** Different pnpm versions can generate different lockfile formats, causing unnecessary conflicts.

### Layer 2: Automated Resolution

**What:** GitHub Action that automatically detects and resolves lockfile conflicts on PRs.

**File:** `lockfile-autoresolve.yml`

**How it works:**
1. Triggers when a PR is opened/updated with changes to lockfiles or package.json
2. Detects merge conflicts in `pnpm-lock.yaml`
3. Removes the conflicted lockfile
4. Runs `pnpm install` to regenerate a clean lockfile
5. Commits and pushes the resolved lockfile back to the PR branch
6. Comments on the PR to notify the author

**Security:** Only runs on PRs from the same repository (not forks) to prevent unauthorized code execution.

### Layer 3: Pre-merge Validation

**What:** GitHub Action that validates lockfile integrity before merging.

**File:** `lockfile-validate.yml`

**How it works:**
1. Triggers on PRs targeting the main branch
2. Validates lockfile is in sync with package.json files
3. Checks for merge conflict markers
4. Verifies lockfile format version
5. Fails the CI if any issues are detected

**Why:** Ensures only valid, conflict-free lockfiles are merged to main.

### Layer 4: Git Merge Strategy

**What:** Git configuration to reduce lockfile conflicts.

**File:** `.gitattributes`

**How it works:**
- Sets `merge=union` strategy for `pnpm-lock.yaml`
- Git attempts to keep changes from both branches automatically
- Marks the file as linguist-generated for better diff display

**Why:** Provides a fallback mechanism for automatic conflict resolution at the Git level.

## For Developers

### If You Get a Lockfile Conflict

**Option 1: Let automation handle it (Recommended)**
1. Push your changes
2. Create/update your PR
3. Wait for the bot to auto-resolve and commit
4. Review the bot's commit
5. Pull the changes to your local branch

**Option 2: Resolve manually**
```bash
# Delete the conflicted lockfile
rm pnpm-lock.yaml

# Reinstall dependencies
pnpm install

# Commit the resolved lockfile
git add pnpm-lock.yaml
git commit -m "chore: resolve pnpm-lock.yaml conflicts"
git push
```

### Prevention Tips

1. **Always use pnpm 9.x**
   ```bash
   # Check your version
   pnpm --version
   
   # Install correct version if needed
   npm install -g pnpm@9
   ```

2. **Keep your branch up-to-date**
   ```bash
   # Before installing new dependencies
   git checkout main
   git pull
   git checkout your-branch
   git merge main
   pnpm install
   ```

3. **Coordinate dependency changes**
   - Communicate with team when adding/updating major dependencies
   - Merge dependency PRs quickly to reduce conflict window

## For Maintainers

### Monitoring

Check the Actions tab for:
- Failed lockfile validation runs
- Auto-resolve activity
- Pattern of frequent conflicts (may indicate coordination issues)

### Troubleshooting

**If auto-resolve keeps failing:**
1. Check if there are conflicting dependency versions in package.json files
2. Manually review the dependency changes in the PR
3. Ask the PR author to rebase on latest main

**If validation keeps failing:**
1. Check if developers are using different pnpm versions
2. Verify CI cache isn't stale
3. Review recent dependency changes for circular dependencies

### Customization

To adjust the automation:

- **Change pnpm version:** Update `package.json` engines and all workflow files
- **Modify auto-resolve behavior:** Edit `.github/workflows/lockfile-autoresolve.yml`
- **Adjust validation rules:** Edit `.github/workflows/lockfile-validate.yml`
- **Change merge strategy:** Edit `.gitattributes`

## Technical Details

### Workflow Triggers

**lockfile-autoresolve.yml:**
- `pull_request` events (opened, synchronize, reopened)
- Only when `pnpm-lock.yaml` or any `package.json` changes
- Only on same-repository PRs (security)

**lockfile-validate.yml:**
- `pull_request` events targeting main branch
- Only when `pnpm-lock.yaml` or any `package.json` changes

### Permissions

Both workflows require:
- `contents: write` - To commit resolved lockfile
- `pull-requests: write` - To comment on PRs

### Cost Considerations

These workflows add minimal CI cost:
- Auto-resolve: ~30-60 seconds per trigger
- Validate: ~20-30 seconds per trigger
- Only trigger on dependency-related changes
- Skip on subsequent commits if lockfile is clean

## Related Resources

- [pnpm Documentation](https://pnpm.io)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Git Attributes Documentation](https://git-scm.com/docs/gitattributes)

## Questions?

If you have questions or issues with the lockfile automation:
1. Check the workflow run logs in GitHub Actions
2. Review this documentation
3. Open an issue with the `automation` label
4. Ask in the team chat
