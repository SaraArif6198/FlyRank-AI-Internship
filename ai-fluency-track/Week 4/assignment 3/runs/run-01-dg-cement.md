# Run 01 — DG Cement offline sync note

## Input

**Audience:** a future maintainer of the payroll system.

**Purpose:** explain why offline behavior is an architectural requirement and what changed after the first sync design failed.

**Facts**

- A cement contractor pays 50+ construction workers from attendance recorded at remote sites.
- The sites barely have signal.
- Attendance is recorded on-device and syncs when a connection appears.
- The first sync design assumed longer connectivity windows than the sites actually get.
- Sara reworked it until a device could go a full shift offline without losing a record.
- The production system has reported zero data loss during outages.
- The system has 28 API endpoints and Sara still supports it.

**Constraints:** 140–180 words; Problem / Decision / Result / Limitation; no worker names or payroll values; use only supplied facts.

## Step 1 — Fact-ledger result

Seven facts accepted. Risk flag: “zero data loss” must stay scoped to reported outages; it cannot become a universal reliability guarantee. Open question: the exact sync/conflict algorithm is not supplied.

## Step 2 — Draft 1 excerpt

Remote attendance cannot depend on a stable connection: the contractor pays 50+ workers from records collected at sites that barely have signal. Attendance is therefore stored on-device and sent when a connection appears. The first implementation expected connectivity windows that were longer than the sites provide, so Sara redesigned synchronization around a full offline shift.

## Step 3 — Critique

- **Unsupported:** “redesigned synchronization around” implies an unspecified algorithm. Change to the observable requirement: a device can complete a full shift offline without losing a record.
- **Distorted:** “cannot depend” is defensible from the signal constraint, but should read as a design requirement, not a measured impossibility.
- **Unclear:** explain that 28 endpoints describes the wider production system, not the sync mechanism.
- **Format:** limitation missing.

## Step 4 — Revision change

Replaced the algorithm implication with the verified full-shift behavior; separated system scale from sync evidence; added the absent algorithm detail as the limitation.

## Step 5 — Final

### Problem

The contractor pays 50+ construction workers from attendance recorded at remote sites, and those sites barely have signal. Reliable offline capture is therefore a system requirement, not a convenience.

### Decision

Attendance is recorded on-device and syncs when a connection appears. The first design assumed longer connectivity windows than the sites actually provide. Sara reworked it until a device could complete a full shift offline without losing a record.

### Result

The production system has reported zero data loss during outages. The wider system exposes 28 API endpoints, and Sara still supports it.

### Limitation

This note does not describe the sync or conflict-resolution algorithm because those implementation details were not included in the fact brief. A maintainer should inspect that code before changing offline behavior.

**Human check:** confirm “zero data loss during outages” still matches the current production record.  
**Status:** READY after human recency check.

