# AI Quality Engineering (AI-QE) Platform

## Participant(s)
- Rahul G

## Problem Statement
Modern release cycles are constantly blocked by trivial bugs, outdated test schemas, or sudden performance bottlenecks. Developers and QA engineers spend hours digging through complex CI/CD logs, APM metrics, and scattered tools just to find the root cause, drastically slowing down feature delivery and time-to-market.

## Solution Summary
The AI-QE Platform redefines Quality Assurance by transforming it into an autonomous Platform Engineering function. It utilizes LLMs to actively monitor CI/CD pipelines, perform Root Cause Analysis (RCA) on server telemetry, and automatically write code patches to heal broken builds without human intervention. The interactive UI provides a centralized hub to command the pipeline and view real-time infrastructure correlation.

## Target Users
- **QA Engineers**: Upgrading their workflow to manage autonomous agents rather than hunting for manual bugs.
- **DevOps/Platform Engineers**: Reducing MTTR (Mean Time To Recovery) on infrastructure incidents.
- **Developers**: Getting immediate, auto-generated fixes for failing unit/integration tests without context-switching.

## Tech Stack
- **Language**: Node.js, Vanilla JavaScript, HTML, CSS
- **Framework**: Express.js
- **Tools**: OS module (Server Telemetry), Node Child Processes (Orchestration)

## Architecture Overview
A lightweight Node.js/Express backend serves the dashboard and provides an interactive `/api/chat` endpoint. The `ai-agent/orchestrator.js` simulates complex AI interactions by manipulating source code files (e.g., `server.js`, `qa.test.js`) dynamically, triggering updates in the UI to visualize auto-healing pipelines.

## Repository Structure
- `src/`: Contains the primary Express server and backend logic (`server.js`).
- `public/`: Contains the frontend dashboard assets (`index.html`, `style.css`, `app.js`).
- `ai-agent/`: Contains the orchestration engine, telemetry simulation, and reset scripts.

## Setup Instructions
1. Navigate to `submissions/ai-qe-assistant/`
2. Run `npm install` to install necessary dependencies.

## Run Instructions
1. Run `npm run reset` to ensure the environment is set to the broken baseline state.
2. Run `npm start` to start the dashboard server.
3. Open your browser and navigate to `http://localhost:3000`.

## Demo Instructions
1. Open the dashboard at `http://localhost:3000`.
2. Notice the "Server Status" section polling live machine hardware metrics.
3. Observe the `DEV-8934` and `QA-8935` pipelines running on specific environments with failing stages.
4. Open the floating "✨ AI Quality Assistant" chat widget.
5. Click any of the 4 suggestion pills:
   - **Fix the unit tests**: Heals `server.js` TypeError.
   - **Fix regression schema**: Heals `qa.test.js` outdated payload.
   - **Analyze performance**: Optimizes DB latency for Performance Testing.
   - **Rollback staging**: Executes a simulated incident rollback.
6. Watch the pipeline UI dynamically enter a loading state and auto-heal in real-time.

## Presentation
- Slides: (See generated slide content from NotebookLM output artifact)
- Video: Live Demo

## Known Limitations
- The current implementation is a local orchestration simulation built specifically for the hackathon demo. True enterprise deployment would require robust isolation for agent executions.
- Server telemetry is sourced from the local machine rather than a distributed cluster.

## License
MIT
