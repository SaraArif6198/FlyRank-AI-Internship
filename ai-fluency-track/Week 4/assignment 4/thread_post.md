Week 4, FL-05: I stopped using “agent” as a synonym for “multi-step.”

My FL-04 Draft–Critique–Revise build is a workflow: the five stages and their handoffs are fixed before the input arrives. Claude produces the content, but it does not choose the route.

I also connected Codex to a folder-scoped Filesystem MCP server. I tested three things plain chat could not do: list live local files, read a project brief, and create then read back a new file.

The useful distinction: MCP gives a model a standard interface to external context and actions. It does not automatically make the model an agent.

To turn FL-04 into one, I would add a bounded evidence-verification loop. The model could choose which claim to check, inspect approved project files or run named tests, observe the result, and continue until each claim had evidence or an explicit unresolved label. Human approval would still control writes and publication.
