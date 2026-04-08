# Job Search -- AI-Powered Pipeline

> AI-powered job search pipeline built on Claude Code. Evaluate offers, generate tailored CVs, scan portals, and track everything -- powered by AI agents.

Based on [career-ops](https://github.com/santifer/career-ops) by Santiago Fernandez. Customized for **Ganesh Hemanth Mamidipalli** -- AI Engineer targeting LLM Systems, GenAI Infrastructure, and Agentic Platform roles.

![Claude Code](https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

---

## What Is This

This system turns Claude Code into a full job search command center:

- **Evaluates offers** with A-F scoring (10 weighted dimensions)
- **Generates tailored PDFs** -- ATS-optimized CVs customized per job description
- **Scans portals** automatically (Greenhouse, Ashby, Lever, company pages)
- **Processes in batch** -- evaluate 10+ offers in parallel with sub-agents
- **Tracks everything** in a single source of truth with integrity checks

Configured for AI/ML Engineering roles across the US market with 45+ pre-configured companies.

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/ganeshmamidipalli/Job_Search.git
cd Job_Search && npm install
npx playwright install chromium   # Required for PDF generation

# 2. Check setup
npm run doctor                     # Validates all prerequisites

# 3. Start using
claude   # Open Claude Code in this directory

# Then use:
# Paste a job URL to evaluate it
# /career-ops scan - to search portals
# /career-ops pdf - to generate CV
# /career-ops tracker - to view applications
```

## Usage

```
/career-ops                - Show all available commands
/career-ops {paste a JD}   - Full auto-pipeline (evaluate + PDF + tracker)
/career-ops scan           - Scan portals for new offers
/career-ops pdf            - Generate ATS-optimized CV
/career-ops batch          - Batch evaluate multiple offers
/career-ops tracker        - View application status
/career-ops apply          - Fill application forms with AI
/career-ops pipeline       - Process pending URLs
/career-ops contacto       - LinkedIn outreach message
/career-ops deep           - Deep company research
/career-ops training       - Evaluate a course/cert
/career-ops project        - Evaluate a portfolio project
```

## Target Roles

| Archetype | Focus |
|-----------|-------|
| AI/LLM Engineer | LLM fine-tuning, RAG pipelines, inference optimization |
| AI Platform / LLMOps | MLflow, Kubeflow, Vertex AI, CI/CD, model governance |
| Agentic Systems Engineer | MCP, A2A, ADK, LangGraph, multi-agent orchestration |
| ML Engineer / MLOps | Training pipelines, feature stores, Kubernetes |
| AI Solutions Architect | System design, enterprise integration, GCP/AWS |
| GenAI Infrastructure | Containerized inference, Cloud Run, GPU optimization |

## Project Structure

```
Job_Search/
├── CLAUDE.md                    # Agent instructions
├── cv.md                        # CV (source of truth)
├── config/
│   └── profile.yml              # Personal profile & targets
├── modes/                       # 14 skill modes
│   ├── _shared.md               # Shared context
│   ├── _profile.md              # Personal customizations
│   └── ...
├── templates/
│   ├── cv-template.html         # ATS-optimized CV template
│   └── states.yml               # Canonical statuses
├── portals.yml                  # Scanner config (45+ companies)
├── batch/                       # Batch processing
├── dashboard/                   # Go TUI pipeline viewer
├── data/                        # Tracking data
├── reports/                     # Evaluation reports
├── output/                      # Generated PDFs
└── docs/                        # Documentation
```

## Tech Stack

- **Agent**: Claude Code with custom skills and modes
- **PDF**: Playwright + HTML template
- **Scanner**: Playwright + Greenhouse API + WebSearch
- **Dashboard**: Go + Bubble Tea + Lipgloss
- **Data**: Markdown tables + YAML config + TSV batch files

## Credits

Based on [career-ops](https://github.com/santifer/career-ops) by [Santiago Fernandez](https://santifer.io). Original system MIT licensed.

## License

MIT
