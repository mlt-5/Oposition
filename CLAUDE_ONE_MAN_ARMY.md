# Claude Code — One Man Army Stack
> Complete MCP Servers + GitHub Repos for Full-Stack Development
> Pre-Development → Development → Testing → Deployment → Post-Development

---

## The Philosophy

```
Claude Code = Brain
+ Agents     = Hands
+ Memory     = Long-term thinking
+ Skills     = Specialized expertise
+ MCP Servers = Eyes & tools
+ Workflows  = Discipline
+ Specs      = Direction
= Invincible One-Man Army
```

---

## Table of Contents

- [MCP Servers](#mcp-servers)
- [Layer 1 — Claude Code Native Enhancement](#layer-1--claude-code-native-enhancement)
- [Layer 2 — Memory Enhancement](#layer-2--memory-enhancement)
- [Layer 3 — Agent Frameworks & Orchestration](#layer-3--agent-frameworks--orchestration)
- [Layer 4 — Spec-Driven Development](#layer-4--spec-driven-development)
- [Layer 5 — Workflow Automation](#layer-5--workflow-automation)
- [Layer 6 — Code Intelligence](#layer-6--code-intelligence--understanding)
- [Layer 7 — Pre-Development](#layer-7--pre-development-research--planning)
- [Layer 8 — Development](#layer-8--development-build-fast)
- [Layer 9 — Testing](#layer-9--testing-zero-manual-qa)
- [Layer 10 — Security](#layer-10--security-no-security-team-needed)
- [Layer 11 — Deployment](#layer-11--deployment-one-command-to-production)
- [Layer 12 — Monitoring](#layer-12--monitoring--observability)
- [Layer 13 — Documentation](#layer-13--documentation-no-tech-writer-needed)
- [Layer 14 — AI Features Inside the App](#layer-14--ai-features-inside-the-app)
- [The Complete One-Man Army Setup](#the-complete-one-man-army-setup)
- [Roles Eliminated](#roles-eliminated)
- [Priority Setup Order](#priority-setup-order)
- [MCP Config Template](#mcp-config-template)

---

## MCP Servers

### Pre-Development
| MCP Server | Purpose |
|------------|---------|
| GitHub MCP | Repo creation, branch strategy, project planning |
| Linear MCP | Issue tracking, sprint planning, roadmaps |
| Notion MCP | Requirements docs, system design, wiki |
| Figma MCP | Read design files, extract tokens, assets |
| Context7 MCP | Fetch latest docs for any library/framework |
| Perplexity/Brave Search MCP | Research, tech stack decisions |

### Development
| MCP Server | Purpose |
|------------|---------|
| GitHub MCP | Commits, branches, PRs, code review |
| Filesystem MCP | Read/write local files across project |
| PostgreSQL MCP | Query, migrate, manage database |
| Supabase MCP | Auth, DB, storage, realtime — all in one |
| Redis MCP | Cache management, session data |
| Docker MCP | Build/run containers, manage services |
| Prisma MCP | Schema management, migrations |
| Context7 MCP | Live docs while coding |

### Testing
| MCP Server | Purpose |
|------------|---------|
| Playwright MCP | Browser automation, E2E testing |
| Puppeteer MCP | UI testing, screenshots, scraping |
| Sentry MCP | Error tracking, crash reports |
| GitHub MCP | CI/CD status checks, Actions |

### Deployment
| MCP Server | Purpose |
|------------|---------|
| Vercel MCP | Deploy frontend, manage domains, env vars |
| AWS MCP | EC2, S3, Lambda, CloudFront management |
| Cloudflare MCP | DNS, CDN, Workers deployment |
| Railway MCP | Full-stack deployment, DB hosting |
| Docker MCP | Container builds for production |
| Kubernetes MCP | Cluster management, scaling |

### Post-Development
| MCP Server | Purpose |
|------------|---------|
| Sentry MCP | Monitor errors, alerts, performance |
| Datadog MCP | Metrics, logs, APM monitoring |
| Grafana MCP | Dashboards, observability |
| Slack MCP | Team alerts, incident notifications |
| PagerDuty MCP | On-call alerting, incident management |
| Gmail MCP | Client reports, automated notifications |
| Google Analytics MCP | User behavior, traffic analysis |
| Stripe MCP | Payment monitoring, revenue tracking |

### Communication & Collaboration (All Stages)
| MCP Server | Purpose |
|------------|---------|
| Slack MCP | Team communication |
| Gmail MCP | Client/stakeholder emails |
| Google Calendar MCP | Sprint meetings, deadlines |
| Google Drive MCP | Share docs, design files, reports |
| Notion MCP | Living documentation |

### Ideal Minimal MCP Stack
```
GitHub + Supabase + Vercel + Playwright + Sentry + Slack + Figma + Context7
```

### MCP Config Template
Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/your/project/path"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/db"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase"],
      "env": {
        "SUPABASE_URL": "your_supabase_url",
        "SUPABASE_SERVICE_ROLE_KEY": "your_service_role_key"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp-server"]
    },
    "docker": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-docker"]
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "your_bot_token",
        "SLACK_TEAM_ID": "your_team_id"
      }
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "@sentry/mcp-server"],
      "env": {
        "SENTRY_AUTH_TOKEN": "your_auth_token"
      }
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/mcp-server"],
      "env": {
        "NOTION_API_KEY": "your_notion_key"
      }
    },
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your_linear_key"
      }
    },
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-server"],
      "env": {
        "VERCEL_TOKEN": "your_vercel_token"
      }
    },
    "redis": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-redis"],
      "env": {
        "REDIS_URL": "redis://localhost:6379"
      }
    }
  }
}
```

---

## Layer 1 — Claude Code Native Enhancement

### Skills & Agents That Extend Claude Directly
| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| anthropic-cookbook | `anthropics/anthropic-cookbook` | Battle-tested Claude agent patterns, multi-agent recipes |
| MCP Servers | `modelcontextprotocol/servers` | Official MCP servers — gives Claude eyes into every tool |
| MCP TypeScript SDK | `modelcontextprotocol/typescript-sdk` | Build custom MCP servers for any tool Claude doesn't support |
| MCP Python SDK | `modelcontextprotocol/python-sdk` | Build Python-based MCP servers for Claude |
| Cline | `cline/cline` | Autonomous Claude agent that plans, codes, tests, fixes in loops |
| Continue | `continuedev/continue` | Claude with full codebase context inside VS Code / JetBrains |
| Aider | `paul-gauthier/aider` | Git-aware Claude that edits entire repos in one shot |
| OpenDevin | `opendevin/opendevin` | Full software engineering agent — Claude acts like a dev team |
| SWE-agent | `princeton-nlp/SWE-agent` | Claude solves real GitHub issues autonomously |

---

## Layer 2 — Memory Enhancement

### Short-term + Long-term Memory for Claude
| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| mem0 | `mem0ai/mem0` | Persistent memory layer — Claude remembers across sessions |
| Chroma | `chroma-core/chroma` | Vector database — Claude stores and retrieves project knowledge |
| pgvector | `pgvector/pgvector` | AI memory inside Postgres — Claude searches past decisions |
| LangChain | `langchain-ai/langchain` | Memory chains — Claude maintains context across long workflows |
| LangGraph | `langchain-ai/langgraph` | Stateful multi-agent workflows with persistent memory |
| LanceDB | `lancedb/lancedb` | Embedded vector DB — Claude has instant local memory |
| Zep | `zep-cloud/zep` | Long-term memory for AI agents, perfect for Claude sessions |
| Cognee | `cognee/cognee` | Structured memory graphs — Claude understands relationships |
| Microsoft GraphRAG | `microsoft/graphrag` | Knowledge graphs from codebases — Claude understands everything |

---

## Layer 3 — Agent Frameworks & Orchestration

### Multi-Agent Systems That Work With Claude
| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| LangGraph | `langchain-ai/langgraph` | Build Claude agent networks that collaborate |
| AutoGen | `microsoft/autogen` | Multi-agent conversations — Claude talks to specialized sub-agents |
| CrewAI | `crewai/crewai` | Claude leads a crew of specialized AI agents |
| Prefect | `prefecthq/prefect` | Claude orchestrates complex multi-step workflows |
| Dagster | `dagster-io/dagster` | Data-aware workflow orchestration Claude can control |
| Temporal | `temporalio/temporal` | Durable workflow execution — Claude's tasks never get lost |
| n8n | `n8n-io/n8n` | Visual workflow automation Claude can build and trigger |
| Windmill | `windmill-labs/windmill` | Scripts + workflows + apps — Claude deploys full automations |
| Activepieces | `activepieces/activepieces` | Open source Zapier — Claude connects any two services |

---

## Layer 4 — Spec-Driven Development

### Define → Generate → Validate Automatically
| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| openapi-typescript | `openapi-ts/openapi-typescript` | Claude generates TypeScript from OpenAPI specs |
| OpenAPI Generator | `openapitools/openapi-generator` | Claude generates entire SDKs from one spec file |
| Spectral | `stoplightio/spectral` | Claude validates API specs before writing a single line |
| AsyncAPI | `asyncapi/asyncapi` | Claude specifies event-driven systems before building |
| GraphQL Spec | `graphql/graphql-spec` | Claude designs GraphQL schemas as the source of truth |
| Pact | `pact-foundation/pact-js` | Claude writes contract tests between services |
| Schemathesis | `schemathesis/schemathesis` | Claude auto-tests APIs against their own specs |
| Redoc | `redocly/redoc` | Claude generates beautiful API docs from specs |
| Swagger UI | `swagger-api/swagger-ui` | Claude publishes interactive API playgrounds instantly |
| Cucumber | `cucumber/cucumber-js` | Claude writes BDD specs in plain English, generates tests |
| Hypothesis | `HypothesisWorks/hypothesis` | Claude generates property-based tests from specs |

---

## Layer 5 — Workflow Automation

### Replace Entire Human Workflows
| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| act | `nektos/act` | Claude runs GitHub Actions locally before pushing |
| starter-workflows | `actions/starter-workflows` | Claude picks best CI/CD template for any stack |
| Renovate | `renovatebot/renovate` | Claude auto-updates all dependencies, never falls behind |
| semantic-release | `semantic-release/semantic-release` | Claude releases versions automatically on every merge |
| git-cliff | `orhun/git-cliff` | Claude generates perfect changelogs from git history |
| commitizen | `commitizen/commitizen` | Claude enforces perfect commit messages |
| pre-commit | `pre-commit/pre-commit` | Claude hooks into git — validates before every commit |
| lefthook | `evilmartians/lefthook` | Fast git hooks — Claude runs checks in parallel |
| Earthly | `earthly/earthly` | Claude runs reproducible builds everywhere |
| Dagger | `dagger/dagger` | Claude writes CI/CD pipelines as code in any language |
| just | `casey/just` | Command runner — Claude defines all project tasks in one file |
| opencommit | `di-sukharev/opencommit` | Claude writes perfect commit messages automatically |

---

## Layer 6 — Code Intelligence & Understanding

### Give Claude Superhuman Code Understanding
| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| Sourcegraph | `sourcegraph/sourcegraph` | Claude navigates any codebase with semantic search |
| tree-sitter | `tree-sitter/tree-sitter` | Claude parses any language into ASTs |
| Semgrep | `returntocorp/semgrep` | Claude writes custom static analysis rules |
| Joern | `joernio/joern` | Claude analyzes code for security vulnerabilities via graphs |
| ripgrep | `BurntSushi/ripgrep` | Claude searches codebases at superhuman speed |
| delta | `dandavison/delta` | Claude sees diffs with full syntax highlighting |
| rust-analyzer | `rust-lang/rust-analyzer` | Claude understands Rust at the compiler level |

---

## Layer 7 — Pre-Development (Research & Planning)

| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| Excalidraw | `excalidraw/excalidraw` | Claude designs system architecture visually |
| PlantUML | `plantuml/plantuml` | Claude generates architecture diagrams from text |
| Mermaid | `mermaid-js/mermaid` | Claude creates flowcharts, ERDs, sequences in markdown |
| Backstage | `backstage/backstage` | Claude manages entire software catalog |
| gitignore | `github/gitignore` | Claude picks perfect `.gitignore` for any stack |
| awesome-selfhosted | `awesome-selfhosted/awesome-selfhosted` | Claude picks self-hosted alternatives to SaaS |
| conventional-commits | `conventional-commits/conventionalcommits.org` | Commit message standard Claude follows |

---

## Layer 8 — Development (Build Fast)

### Boilerplates & Starters
| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| create-t3-app | `t3-oss/create-t3-app` | Next.js + TypeScript + Prisma + tRPC in one command |
| epic-stack | `epicweb-dev/epic-stack` | Production-ready full-stack from day 1 |
| Next.js | `vercel/next.js` | Claude's most deeply known full-stack framework |
| Nuxt | `nuxt/nuxt` | Vue full-stack framework |
| SvelteKit | `sveltejs/kit` | Svelte full-stack framework |
| RedwoodJS | `redwoodjs/redwood` | Full-stack JS opinionated framework |

### Frontend
| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| shadcn/ui | `shadcn-ui/ui` | Claude builds production UIs by composing named components |
| Tailwind CSS | `tailwindlabs/tailwindcss` | Claude designs without a designer |
| Radix UI | `radix-ui/primitives` | Accessible components, Claude never misses a11y |
| TanStack Query | `TanStack/query` | Claude handles all server state automatically |
| TanStack Router | `TanStack/router` | Fully type-safe routing |
| Zustand | `pmndrs/zustand` | Claude manages state in 10 lines instead of 100 |
| Motion | `motiondivision/motion` | Claude adds professional animations instantly |
| React Three Fiber | `pmndrs/react-three-fiber` | Claude builds 3D experiences |
| React Hook Form | `react-hook-form/react-hook-form` | Performant forms |
| Zod | `colinhacks/zod` | Type-safe validation at runtime and compile time |
| Biome | `biomejs/biome` | One tool replaces ESLint + Prettier |

### Backend
| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| Supabase | `supabase/supabase` | Claude replaces entire backend team |
| Prisma | `prisma/prisma` | Type-safe database queries and migrations |
| tRPC | `trpc/trpc` | End-to-end APIs with zero drift |
| Hono | `honojs/hono` | Ultra-fast APIs on any edge runtime |
| PocketBase | `pocketbase/pocketbase` | Entire backend as single binary |
| Fastify | `fastify/fastify` | Fast Node.js framework |
| NestJS | `nestjs/nest` | Enterprise Node.js framework |
| Nitro | `unjs/nitro` | Universal server that runs anywhere |
| FastAPI | `tiangolo/fastapi` | Python API framework |
| Drizzle ORM | `drizzle-team/drizzle-orm` | Lightweight SQL ORM with type safety |

### Authentication
| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| NextAuth.js | `nextauthjs/next-auth` | Auth for Next.js |
| Lucia | `lucia-auth/lucia` | Simple session-based auth |
| Ory Kratos | `ory/kratos` | Identity & user management |

---

## Layer 9 — Testing (Zero Manual QA)

| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| Playwright | `microsoft/playwright` | Claude writes and runs E2E tests autonomously |
| Vitest | `vitest-dev/vitest` | Claude unit tests everything it writes |
| MSW | `mswjs/msw` | Claude mocks APIs so frontend never blocks on backend |
| Storybook | `storybook/storybook` | Claude tests every UI component in isolation |
| k6 | `grafana/k6` | Claude load tests before every release |
| Argos | `argos-ci/argos` | Claude catches visual regressions automatically |
| Testcontainers | `testcontainers/testcontainers-node` | Claude runs real services in tests, no mocks |
| Testing Best Practices | `goldbergyoni/javascript-testing-best-practices` | Claude follows testing gospel |

---

## Layer 10 — Security (No Security Team Needed)

| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| OWASP CheatSheets | `OWASP/CheatSheetSeries` | Security best practices for every decision |
| Trivy | `aquasecurity/trivy` | Claude scans containers for CVEs automatically |
| TruffleHog | `trufflesecurity/trufflehog` | Claude catches secrets before they hit GitHub |
| Gitleaks | `gitleaks/gitleaks` | Claude scans git history for leaked credentials |
| Semgrep | `returntocorp/semgrep` | Claude writes custom security rules |
| Snyk CLI | `snyk/cli` | Claude audits every dependency before merge |
| OWASP ZAP | `zaproxy/zaproxy` | Claude runs automated penetration tests |
| DOMPurify | `cure53/DOMPurify` | Claude sanitizes all user input, XSS eliminated |

---

## Layer 11 — Deployment (One Command to Production)

| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| Coolify | `coollabsio/coolify` | Claude owns self-hosted deployment infrastructure |
| CapRover | `caprover/caprover` | Claude deploys 100+ apps on one server |
| Dokku | `dokku/dokku` | Claude manages self-hosted PaaS like Heroku |
| Docker Compose | `docker/compose` | Claude orchestrates all services locally and in prod |
| Terraform | `hashicorp/terraform` | Claude provisions cloud infrastructure as code |
| Pulumi | `pulumi/pulumi` | Claude writes infra in TypeScript alongside app code |
| Flux | `fluxcd/flux2` | Claude implements GitOps — git push = deploy |
| Argo CD | `argoproj/argo-cd` | Claude manages Kubernetes deployments via GitOps |
| LocalStack | `localstack/localstack` | Claude tests AWS services locally, no cloud costs |

---

## Layer 12 — Monitoring & Observability

| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| Sentry | `getsentry/sentry` | Claude sees every error with full stack trace |
| Uptime Kuma | `louislam/uptime-kuma` | Claude monitors all services, alerts on downtime |
| Grafana | `grafana/grafana` | Claude builds observability dashboards |
| Prometheus | `prometheus/prometheus` | Claude collects all metrics automatically |
| OpenTelemetry | `open-telemetry/opentelemetry-js` | Claude traces every request across services |
| Highlight | `highlight/highlight` | Claude watches real user sessions |
| Netdata | `netdata/netdata` | Claude monitors servers in real-time, zero config |

---

## Layer 13 — Documentation (No Tech Writer Needed)

| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| Docusaurus | `facebook/docusaurus` | Claude builds entire documentation sites |
| Starlight | `withastro/starlight` | Claude generates beautiful docs from markdown |
| JSDoc | `jsdoc/jsdoc` | Claude documents every function automatically |
| TypeDoc | `TypeStrong/typedoc` | Claude generates TypeScript API docs |
| Storybook | `storybook/storybook` | Claude documents every UI component visually |
| Redoc | `redocly/redoc` | Claude publishes API reference from OpenAPI spec |
| Mermaid | `mermaid-js/mermaid` | Claude embeds live diagrams in any markdown |

---

## Layer 14 — AI Features Inside the App

### Claude Building Claude-Powered Apps
| Repo | GitHub URL | What It Unlocks |
|------|-----------|----------------|
| Vercel AI SDK | `vercel/ai` | Claude adds streaming AI to Next.js apps in minutes |
| Anthropic TS SDK | `anthropics/anthropic-sdk-typescript` | Claude calls itself programmatically |
| Anthropic Python SDK | `anthropics/anthropic-sdk-python` | Claude builds Python AI agents |
| Anthropic Cookbook | `anthropics/anthropic-cookbook` | Claude uses proven AI patterns |
| LangChain JS | `langchain-ai/langchainjs` | Claude chains AI calls for complex reasoning |
| LangGraph | `langchain-ai/langgraph` | Claude builds stateful AI agent networks |
| Chroma | `chroma-core/chroma` | Claude adds RAG and semantic search to any app |
| pgvector | `pgvector/pgvector` | Claude builds AI search directly in Postgres |
| mem0 | `mem0ai/mem0` | Claude gives the app persistent user memory |
| Microsoft GraphRAG | `microsoft/graphrag` | Claude builds knowledge graphs for complex domains |

---

## The Complete One-Man Army Setup

```
BRAIN
└── Claude Code (claude-sonnet-4-6)

MEMORY
├── mem0ai/mem0              (persistent cross-session memory)
├── chroma-core/chroma       (vector knowledge base)
└── cognee/cognee            (structured memory graphs)

AGENTS
├── cline/cline              (autonomous task execution)
├── crewai/crewai            (specialized sub-agents)
└── langchain-ai/langgraph   (multi-agent orchestration)

SKILLS
├── continuedev/continue     (editor integration)
├── paul-gauthier/aider      (full repo editing)
└── modelcontextprotocol/servers (all MCP tools)

SPECS
├── openapi-typescript       (API contracts)
├── prisma/prisma            (data contracts)
└── colinhacks/zod           (runtime contracts)

WORKFLOW
├── semantic-release         (automated releases)
├── renovatebot/renovate     (automated dependency updates)
├── pre-commit/pre-commit    (automated validation)
└── dagger/dagger            (portable CI/CD)

STACK
├── t3-oss/create-t3-app     (foundation)
├── supabase/supabase        (backend)
├── shadcn-ui/ui             (frontend)
├── microsoft/playwright     (testing)
├── coollabsio/coolify       (deployment)
└── getsentry/sentry         (monitoring)
```

---

## Roles Eliminated

| Traditional Role | Eliminated By |
|-----------------|--------------|
| Frontend Developer | Claude + Next.js + shadcn + TanStack |
| Backend Developer | Claude + Supabase + tRPC + Hono |
| Database Admin | Claude + Prisma + pgvector |
| UI/UX Designer | Claude + shadcn + Tailwind + Motion |
| QA Engineer | Claude + Playwright + Vitest + k6 |
| DevOps Engineer | Claude + Docker + Dagger + Coolify |
| Security Engineer | Claude + Trivy + Semgrep + OWASP |
| SRE | Claude + Sentry + Prometheus + Grafana |
| Tech Writer | Claude + Docusaurus + Storybook |
| Release Manager | Claude + semantic-release + git-cliff |
| Solutions Architect | Claude + Excalidraw + Mermaid |
| AI Engineer | Claude + LangGraph + mem0 + Chroma |
| Data Engineer | Claude + Dagster + pgvector + GraphRAG |

---

## Priority Setup Order

### Week 1 — Foundation
```
1. modelcontextprotocol/servers    ← Claude gets eyes into every tool
2. continuedev/continue            ← Claude enters your editor
3. mem0ai/mem0                     ← Claude gets persistent memory
4. t3-oss/create-t3-app            ← perfect full-stack boilerplate
```

### Week 2 — Automation
```
5. pre-commit/pre-commit           ← never ship bad code
6. renovatebot/renovate            ← never fall behind on deps
7. semantic-release                ← never release manually again
8. dagger/dagger                   ← portable CI/CD pipelines
```

### Week 3 — Intelligence
```
9.  cline/cline                    ← Claude works autonomously
10. crewai/crewai                  ← Claude leads sub-agents
11. chroma-core/chroma             ← Claude has a knowledge base
12. langchain-ai/langgraph         ← multi-agent orchestration
```

### Week 4 — Production
```
13. coollabsio/coolify             ← Claude owns deployment
14. getsentry/sentry               ← Claude monitors everything
15. microsoft/playwright           ← Claude tests everything
16. grafana/grafana                ← Claude observes everything
```

---

## Quick Reference: GitHub URLs

```
# Claude Code Enhancement
anthropics/anthropic-cookbook
modelcontextprotocol/servers
modelcontextprotocol/typescript-sdk
cline/cline
continuedev/continue
paul-gauthier/aider
opendevin/opendevin
princeton-nlp/SWE-agent

# Memory
mem0ai/mem0
chroma-core/chroma
pgvector/pgvector
lancedb/lancedb
zep-cloud/zep
cognee/cognee
microsoft/graphrag

# Agents & Orchestration
langchain-ai/langgraph
microsoft/autogen
crewai/crewai
prefecthq/prefect
dagster-io/dagster
temporalio/temporal
n8n-io/n8n
windmill-labs/windmill

# Spec-Driven Development
openapi-ts/openapi-typescript
openapitools/openapi-generator
stoplightio/spectral
schemathesis/schemathesis
cucumber/cucumber-js

# Workflow Automation
nektos/act
renovatebot/renovate
semantic-release/semantic-release
orhun/git-cliff
pre-commit/pre-commit
dagger/dagger
casey/just

# Frontend
vercel/next.js
shadcn-ui/ui
tailwindlabs/tailwindcss
TanStack/query
TanStack/router
pmndrs/zustand
colinhacks/zod
biomejs/biome
motiondivision/motion

# Backend
supabase/supabase
prisma/prisma
trpc/trpc
honojs/hono
pocketbase/pocketbase
drizzle-team/drizzle-orm
nextauthjs/next-auth

# Testing
microsoft/playwright
vitest-dev/vitest
mswjs/msw
storybook/storybook
grafana/k6
testcontainers/testcontainers-node

# Security
OWASP/CheatSheetSeries
aquasecurity/trivy
trufflesecurity/trufflehog
gitleaks/gitleaks
returntocorp/semgrep
cure53/DOMPurify

# Deployment
coollabsio/coolify
caprover/caprover
dokku/dokku
hashicorp/terraform
pulumi/pulumi
fluxcd/flux2
localstack/localstack

# Monitoring
getsentry/sentry
louislam/uptime-kuma
grafana/grafana
prometheus/prometheus
netdata/netdata

# Documentation
facebook/docusaurus
withastro/starlight
mermaid-js/mermaid
redocly/redoc

# AI Inside the App
vercel/ai
anthropics/anthropic-sdk-typescript
anthropics/anthropic-sdk-python
langchain-ai/langchainjs
pgvector/pgvector
```

---

*Last updated: 2026-05-22*
*Stack: Claude Code + One Man Army*
