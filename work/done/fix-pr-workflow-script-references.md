# Fix PR Workflow Script References

**Date:** 2026-05-08  
**Status:** Open  
**Priority:** High  
**Severity:** High — CI/CD pipeline broken, PRs will fail checks  
**Route:** N/A (CI/CD)

---

## Problem Statement

GitHub Actions PR checks workflow (`.github/workflows/pr-checks.yml`) references npm scripts that don't exist in `package.json`, causing all PR checks to fail on the `format` job.

## Steps to Reproduce

1. Push branch to GitHub
2. Open pull request against `main`
3. GitHub Actions runs `pr-checks.yml`
4. Format job runs `npm run format:check`

**Expected:** Format check runs and completes  
**Actual:** Job fails with "Missing script: format:check"

## Root Cause

Workflow file copied from template or other project that uses Prettier. This project doesn't have Prettier configured and doesn't have `format:check` script in `package.json`.

**Current scripts in package.json:**

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "jest",
  "test:watch": "jest --watch"
}
```

**Scripts referenced in workflow but missing:**

- `format:check` — doesn't exist, no Prettier config
- No specific `audit:security` script (workflow uses `npm audit` directly, which is fine)

## Affected Files

| Action | File                                      | Role                          |
| ------ | ----------------------------------------- | ----------------------------- |
| Modify | `.github/workflows/pr-checks.yml`         | CI/CD workflow configuration  |
| Modify | `package.json` (optional alternative fix) | Add missing scripts if needed |

## Required Changes

**Option A: Remove format job** (recommended — no Prettier configured)

Remove the entire `format` job from workflow since project doesn't use Prettier:

```yaml
# DELETE this entire job section:
format:
  name: Format Check
  runs-on: ubuntu-latest
  needs: setup

  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: "25.2.1"
        cache: "npm"

    - name: Install dependencies
      run: npm ci

    - name: Check formatting
      run: npm run format:check
```

And update the `build` job dependency:

```yaml
# OLD:
needs: [format, lint, typecheck, test, security]

# NEW:
needs: [lint, typecheck, test, security]
```

**Option B: Add Prettier** (if formatting checks desired)

Add Prettier config and scripts to package.json (more work, not required for current feature set).

## Acceptance Criteria

- [ ] PR checks workflow only references scripts that exist in package.json
- [ ] All jobs in workflow can run successfully
- [ ] `npm run lint` job continues to work (uses existing script)
- [ ] `npm test` job continues to work (uses existing script)
- [ ] `npm run build` job continues to work (uses existing script)
- [ ] Workflow does NOT reference `format:check` (removed or script added)
- [ ] Push to branch triggers workflow without script errors

## Steps to Verify Fix

1. Update `.github/workflows/pr-checks.yml` per Required Changes
2. Commit and push to `ads` branch
3. Check GitHub Actions tab → PR Checks workflow should show all jobs passing (or running)

**Expected after fix:** All jobs run without "Missing script" errors

## Test Cases

- [ ] Test: Push to PR branch → workflow runs all jobs without script errors
- [ ] Test: Run `npm run lint` locally → exits 0
- [ ] Test: Run `npm test` locally → exits 0
- [ ] Test: Run `npm run build` locally → exits 0

## Verification

```bash
npm run lint && npm test && npm run build
```

Then push to GitHub and verify Actions pass.
