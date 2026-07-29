# Agent Concepts and MCP Basics

**Code:** FL-05  
**Track:** General AI Fluency  
**Student:** Sara Arif  
**Evidence setup:** Codex + official Filesystem MCP server

## What an agent is—and what it is not

“Agent” should describe who controls the route, not how impressive the output sounds. A normal chat answers a prompt. A workflow may make several model calls or use tools, but its route is decided in advance. An agent receives a goal and decides what to do next: it can choose a tool, inspect the result, revise its plan, and repeat until it reaches a stopping condition or asks a human for help.

That makes autonomy a design choice, not a badge. Agents are useful when the correct steps cannot be known beforehand—for example, diagnosing a fault that may require searching different files depending on what each test reveals. They also cost more time and tokens, and their flexible paths are harder to predict and evaluate. For a stable, repeatable task, a workflow is often the stronger design.

## Workflow versus agent

The clean test is control flow. In a **workflow**, the builder defines the path: step A hands to B, then C, with fixed gates. The model works inside that route. In an **agent**, the model directs the path while it runs. It chooses which actions are necessary from the evidence it observes.

My FL-04 Draft–Critique–Revise pipeline is a **workflow**. Its route is fixed before any input arrives: intake builds a fact ledger; drafting produces cited copy; critique checks four named risks; revision applies the issue log; verification returns a status and a human-check list. The same five stages run in the same order. Even the final human gate is predetermined. Claude generates content inside each stage, but it cannot decide to skip drafting, inspect a source repository, run a benchmark, or invent a new verification step. A multi-step prompt is not automatically an agent.

## What MCP adds

The Model Context Protocol (MCP) is a standard way for an AI application to connect to capabilities outside the conversation. The host in my test is Codex. It connects through an MCP client to one or more servers, and each server exposes a clear interface. Instead of every AI product needing a custom integration for every file store or service, MCP gives them a shared protocol.

MCP servers can expose three primitives:

- **Tools** are executable operations the model can choose, such as reading a file, searching a directory, or creating a document.
- **Resources** are addressable context the application can supply, such as file contents, database records, or repository history.
- **Prompts** are reusable, user-selected instruction templates that package a known interaction.

The distinction matters because MCP is plumbing, not agency. Connecting a filesystem server gives the model hands, but it does not decide how much freedom the model should have. A fixed workflow can use MCP tools, and an agent can operate without MCP through another tool interface. MCP standardizes access; the surrounding system supplies goals, permissions, control flow, and stopping rules.

For my evidence setup, I connected Codex to the official Filesystem MCP server and limited it to this assignment folder. Three tests prove the connection: listing the allowed directory, reading an existing brief, and creating a new summary file. Plain chat could guess what files might contain, but it could not inspect the live directory or write a file there. The evidence must show Codex’s filesystem MCP tool call as well as the returned result; a text answer alone is not proof.

## What FL-04 would need to become an agent

One concrete upgrade is an **evidence-verification agent** around the existing writing stages. I would give it a goal—produce supportable portfolio copy—and a bounded tool set: read approved project files, search the repository, run named tests, and inspect benchmark outputs. After intake, the model would decide which claim needs checking, choose the relevant tool, observe the result, and either gather more evidence, weaken the claim, or ask me for a missing fact. It would stop only when every checkable claim had evidence or an explicit unresolved label.

That changes control flow instead of merely adding another prompt. A test failure could send the agent to the implementation and then back to the test; a missing source could trigger a human question; a verified claim could proceed directly to drafting. The current critique and final human approval should remain as guardrails. File access would be allow-listed, write actions would require approval, and publishing would stay outside the agent’s permissions.

The upgrade would add flexibility where FL-04 is weakest: its fact ledger checks whether copy matches supplied facts, but not whether those facts are true or current. The agent could gather live evidence. I would only accept the extra complexity if evaluation showed better claim accuracy than the simpler workflow, because autonomy is valuable when it resolves uncertainty—not when it merely makes a fixed pipeline harder to inspect.

## Sources read

- Anthropic, [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- Model Context Protocol, [Architecture overview](https://modelcontextprotocol.io/docs/learn/architecture)
- Model Context Protocol, [Server primitives](https://modelcontextprotocol.io/specification/draft/server/index)
- Model Context Protocol, [Connect to local MCP servers](https://modelcontextprotocol.io/docs/develop/connect-local-servers)
