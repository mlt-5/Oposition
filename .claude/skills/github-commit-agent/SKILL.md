---
name: github-commit-agent
description: Autonomous agent that stages changed files, generates a commit message, commits to git, and pushes to the remote GitHub branch. Use when user says "commit", "push", "commit and push", "save my changes to GitHub", or wants to commit work to a remote branch.
---

# GitHub Commit Agent

## Quick start

Run this skill and it will:
1. Inspect what's changed
2. Stage relevant files
3. Generate a meaningful commit message
4. Commit using the `commit-commands:commit` skill
5. Push to the remote branch
6. Report what was done

## Workflow

### 1. Inspect changes

```bash
git status
git diff --stat
```

Review staged and unstaged changes. Flag any files that look risky (`.env`, secrets, large binaries) and ask the user before staging them.

### 2. Stage files

Stage all modified/new tracked files, excluding anything suspicious:

```bash
git add <specific files>
```

Never use `git add .` blindly — review first.

### 3. Commit

Invoke the `commit-commands:commit` skill to generate the commit message and create the commit. Follow its conventions (conventional commits format if used in the repo, otherwise match existing style from `git log`).

### 4. Push

```bash
git push
```

If the branch has no upstream yet:

```bash
git push -u origin HEAD
```

If the push is rejected (non-fast-forward), report to the user — do NOT force push.

### 5. Report

Tell the user:
- Which files were committed
- The commit message used
- The branch and remote it was pushed to
- The commit SHA

## Guardrails

- Never force push (`--force`) without explicit user instruction
- Never skip hooks (`--no-verify`)
- Never commit `.env`, credential files, or secrets — warn the user instead
- If there's nothing to commit, say so clearly
