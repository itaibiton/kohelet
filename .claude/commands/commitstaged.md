Generate a commit message for the currently staged files.

Steps:
1. Run `git diff --cached --stat` to see what files are staged
2. Run `git diff --cached` to see the actual changes
3. Analyze the changes and generate a conventional commit message following this format:

```
<type>: <short description>

- <bullet point 1>
- <bullet point 2>
- ...
```

Types: feat, fix, refactor, style, docs, test, chore

Guidelines:
- Keep the first line under 72 characters
- Use imperative mood ("add" not "added")
- Focus on WHAT changed and WHY, not HOW
- Group related changes in bullet points
- Be concise but informative

Output ONLY the commit message, nothing else.
