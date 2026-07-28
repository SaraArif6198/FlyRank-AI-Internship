# Run 05 — Inventory role boundary note

## Input

**Audience:** an operations manager assessing the Inventory Management System.

**Purpose:** explain the stock-control loop and why cashier/admin permissions differ.

**Facts**

- The system is a portfolio build modeled on a small shop; there is no paying shop behind it yet.
- It is a C# desktop system built in Visual Studio with SQL Server.
- A cashier can access the POS screen only.
- Every sale decrements stock automatically.
- Admin functions include low-stock alerts, PDF/CSV reports, and an audit log on every stock change showing who changed it and when.
- Role-based access prevents cashiers from editing inventory.
- An AI chatbot answers stock questions and triggers automatic restock entries when an item runs out.
- The complete working system includes POS, alerts, audit trail, reports, and chatbot.

**Constraints:** 150–190 words; Operating loop / Access decision / Evidence / Limitation; avoid invented business outcomes.

## Step 1 — Fact-ledger result

Eight facts accepted. Risk flags: “complete working” does not establish external adoption, production use, accuracy, or security testing. The chatbot’s restock trigger needs human review before a real deployment.

## Step 2 — Draft 1 excerpt

At checkout, the cashier works from one POS screen. Each sale decrements stock, which feeds the low-stock view available to the administrator.

## Step 3 — Critique

- **Unsupported:** the facts list alerts but do not explicitly say the sale directly “feeds” a particular view. Remove that causal UI detail.
- **Distorted:** do not call the role model secure; state the permission boundary.
- **Unclear:** separate built features from real-shop outcomes.
- **Format:** label portfolio status and chatbot review risk.

## Step 4 — Revision change

Removed the inferred UI handoff; described the exact role boundary; separated system completeness from adoption; added human approval as a deployment concern.

## Step 5 — Final

### Operating loop

The Inventory Management System is a C# desktop application built in Visual Studio with SQL Server. A cashier works from the POS screen, and every sale decrements stock automatically. Admin functions include low-stock alerts, PDF/CSV reports, and an audit log that records who changed stock and when.

### Access decision

Cashiers cannot edit inventory. That boundary keeps checkout work separate from stock administration instead of giving every user the same controls.

### Evidence

The working portfolio build includes POS, alerts, an audit trail, reports, and an AI chatbot. The chatbot answers stock questions and triggers automatic restock entries when an item runs out.

### Limitation

No paying shop uses the system yet, so no business outcome or external adoption is claimed. Before real deployment, the chatbot-triggered restock path needs an explicit human approval and audit review.

**Human check:** decide whether automatic restock should create a proposal or a committed entry in real operations.  
**Status:** READY as portfolio documentation.

