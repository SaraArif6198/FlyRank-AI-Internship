# Codex MCP setup and screenshot walkthrough

Use **Codex** with the official **Filesystem MCP server**. The earlier `codebase-memory-mcp` registration is not valid evidence because its configured executable does not exist and the server failed to start.

## 1. Remove the broken registration

In the same PowerShell terminal where `codex mcp list` showed the server, run:

```powershell
codex mcp remove codebase-memory-mcp
```

If PowerShell blocks `codex.ps1`, use:

```powershell
codex.cmd mcp remove codebase-memory-mcp
```

## 2. Add the working Filesystem MCP server

Node.js is already installed. Run this as one line:

```powershell
codex.cmd mcp add filesystem -- npx.cmd -y @modelcontextprotocol/server-filesystem F:\FlyRank\mcp-demo
```

Keep the command on one physical line. The short path deliberately contains no spaces, so PowerShell or copied line wrapping cannot corrupt the server argument.

Then verify:

```powershell
codex mcp list
codex mcp get filesystem
```

The result must show `filesystem` as enabled and the allowed path `F:\FlyRank\mcp-demo`.

## 3. Take the connection screenshot

1. Keep the successful `codex mcp list` and `codex mcp get filesystem` results visible.
2. Press **Win + Shift + S** and choose **Rectangular snip**.
3. Capture the terminal without unrelated notifications or private information.
4. Save it in Assignment 4 as `00-mcp-connected.png`.

Do not use the earlier `mcp in codex .png` as final evidence: it points to a missing executable.

## 4. Restart Codex

Completely close the current Codex session and open a new one in `F:\FlyRank`. MCP servers are initialized at session startup.

## 5. Run the three MCP tasks

For every task, explicitly require the `filesystem` MCP server. A normal shell command is not enough for this assignment. Keep the prompt, MCP tool call, and returned result visible in the screenshot.

### Task 1 — inspect a live directory

Paste:

> Use only the connected `filesystem` MCP server for this task. List the files in its allowed directory. Show the MCP tool call and report every returned filename.

Expected proof: a Filesystem MCP directory-listing tool and `project-brief.txt`.

Save the screenshot as `01-list-directory.png`.

### Task 2 — read information unavailable to chat

Paste:

> Use only the connected `filesystem` MCP server to read `project-brief.txt`. Return the project name, all fixed workflow stages, and the unresolved evidence gap. Show the MCP tool call.

Expected proof: a Filesystem MCP read tool plus the exact stage names and evidence gap from the file.

Save the screenshot as `02-read-file.png`.

### Task 3 — create external state and verify it

Paste:

> Use only the connected `filesystem` MCP server to create `mcp-task-summary.md` in the allowed directory. Include a heading, today's date, the three MCP tasks completed, and one sentence explaining why plain chat could not perform them. Then use the MCP server to read the file back and show its complete contents.

Expected proof: an MCP write call, an MCP read-back call, and the new file contents.

Save the screenshot as `03-create-and-read.png`.

## 6. Attach screenshots to `index.html`

1. Open `index.html` in Chrome or Edge.
2. Scroll to **Working MCP connection**.
3. Click **Add screenshots**.
4. Select `00`, `01`, `02`, and `03` together.
5. Confirm they appear in numerical order.
6. Click **Print / Save PDF**.
7. Select A4, enable **Background graphics**, and save the PDF.
8. Open the PDF and confirm every MCP tool call is readable.

## If the Filesystem MCP still fails

- Run `node --version` and `npx --version`.
- Check that `F:\FlyRank\mcp-demo` exists.
- Use the absolute quoted Windows path exactly as shown.
- Run `codex mcp get filesystem` and check its command and arguments.
- Fully restart Codex after adding or changing the server.
- Do not submit a screenshot containing “failed to start” or “server was not ready.”
