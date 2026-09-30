TASK: Add ONE new section to the existing page (its current text is provided separately). Output one `## ` heading plus the section prose, markdown. The section will be inserted as SECTION 2, right after the existing section 1 ("Robinhood AI Trading Splits into Two Separate Products").

Heading (noun phrase, Title Case, your wording may vary slightly): "Robinhood Agents: The In-App AI Traders Announced September 29, 2026"

reader question: "What are Robinhood Agents and how are they different from connecting my own AI?" [PAA 3/6 on-topic: What are Robinhood agents? / How do I connect an agent to Robinhood? / Which AI agent is best for Robinhood?; 3/6 off-topic: general Robinhood downsides and fees; ac 3/8 on-topic]
answer: Definition + mechanism. Robinhood Agents are AI agents built into the Robinhood app (announced Sept 29, 2026, rolling out to eligible U.S. customers) that research, propose and place trades from a separate, separately funded agent account, with trade approvals on by default and Loops (coming soon) that can run a strategy on repeat around the clock; the May 2026 route instead lets an outside agent (ChatGPT, Claude, Codex and others) connect through Robinhood's MCP server, with approvals off by default.
Open the section with that answer in the first two sentences.

COVER, in this order, using ONLY the fact list:
1. What the built-in agent is; announced Sept 29, 2026 at HOOD Summit; "coming soon to eligible U.S. customers" (do not say it is available to everyone; note CoinDesk's "still rolling out").
2. The dedicated agent account (only funds you deposit there), one built-in agent per customer, mobile-app only for now.
3. Trade approvals: on by default for built-in agents, off by default for MCP accounts; what "on" means; some trades still need approval; CA/CT crypto rule.
4. Loops (coming soon) and the no-guarantee line.
5. Models and cost: Robinhood's wording ("several leading AI labs including OpenAI"; GPT-Luna usage free until end of 2026); model names beyond that only as reported by Fortune; no prices for other models.
6. What agents can trade: long equities, options, crypto; order types; no crypto transfer/staking; state exceptions. Crypto perpetual futures (up to 10x BTC/ETH, 3x others) announced alongside but NOT an agent feature, coming in the months ahead.
7. Agent Apps: premium data add-ons with one-month free trials; give two or three examples with prices from the list, not all.
8. A short numbered setup walkthrough for the built-in agent (Agents tab → name → agreements → open and fund the account → keep approvals on → choose a model), then the outside-agent path in 3 steps with the MCP link and one example command (Claude Code) from the list. Advise funding the agent account only with money you can afford to lose.
9. Risk: quote the two Robinhood disclosures verbatim ("You assume all risk for trades executed by AI agents." and "Robinhood does not control, supervise, monitor, recommend, or audit agents."); connected agents get read-only access to all your accounts' data.
10. Adoption: 150,000+ agentic accounts since May; ~30 million tool uses a day.

Length: 600 to 900 words. Markdown numbered lists allowed. Use each external link at most once, from the closed URL list only. Internal links allowed (each at most once): /guides/robinhood-24-hour-trading/, /guides/is-robinhood-safe/, /guides/wash-sale-rule-explained/. Do not repeat what the page already says about Cortex, the May beta, or Gold pricing; refer back briefly instead. No first-person claims. General information, not investment advice.

CLOSED FACT LIST:

# CLOSED FACT LIST — Robinhood Agents (announced HOOD Summit, Sep 29–30, 2026) and the May 2026 agentic trading / MCP route

## Announcement and what it is
- Robinhood announced Robinhood Agents in a newsroom post dated Sep 29, 2026, tied to HOOD Summit '26 in Houston (Sep 29–30, 2026). [source: https://robinhood.com/us/en/newsroom/hood-summit-2026/]
- Robinhood describes the agents as able to analyze the market, build strategies, and trade on the customer's behalf, built into the Robinhood app. [source: https://robinhood.com/us/en/newsroom/hood-summit-2026/]
- Setup in the app: name the agent, open a dedicated account, review trade approval setting, choose a model. [source: https://robinhood.com/us/en/support/articles/setting-up-an-agent/]
- Setup starts from the "Agents" tab at the top of the Robinhood mobile app; the customer reviews and signs an account agreement and an agentic agreement. [source: https://robinhood.com/us/en/support/articles/setting-up-an-agent/]
- The full built-in agent experience (setting up and chatting with the agent) is currently available only in the Robinhood mobile app; on the web, agentic accounts "may have limited usability." [source: https://robinhood.com/us/en/support/articles/setting-up-an-agent/]
- A customer can currently have one built-in agent on Robinhood, and must have an open primary Robinhood individual investing account. [source: https://robinhood.com/us/en/support/articles/setting-up-an-agent/]
- The customer can pause the agent's automations or disconnect it at any time. [source: https://robinhood.com/us/en/support/articles/setting-up-an-agent/]

## Dedicated agent account
- Agents trade from a dedicated, separately funded account; the agent only has access to the funds deposited into that account. [source: https://robinhood.com/us/en/newsroom/robinhood-is-now-open-to-agents/]
- The agent account is funded by transfer from a bank or another Robinhood account; no minimum is stated. [source: https://robinhood.com/us/en/support/articles/setting-up-an-agent/]

## Approval (confirmation) mode vs autonomous mode
- Trade approvals are a setting shown during setup that "defaults to on" and is adjustable at any time. [source: https://robinhood.com/us/en/newsroom/hood-summit-2026/]
- Trade approvals are on by default for Robinhood Agents (built-in agents) and off by default for MCP accounts (external agents). [source: https://robinhood.com/us/en/support/articles/trading-with-your-agent/]
- With approvals on, the agent can propose trades but the customer must review and manually place the proposed orders in the Robinhood app. [source: https://robinhood.com/us/en/support/articles/trading-with-your-agent/]
- Certain trades may still require approval even when trade approvals are turned off. [source: https://robinhood.com/us/en/support/articles/trading-with-your-agent/]
- In California and Connecticut, trade approvals must stay on for crypto trades (built-in agents). [source: https://robinhood.com/us/en/support/articles/trading-with-your-agent/]
- With approvals off, agents can place orders without asking the customer to confirm each one. [secondary: CoinDesk] [source: https://www.coindesk.com/markets/2026/09/30/robinhood-is-giving-customers-an-ai-agent-that-trades-for-them-plus-10x-crypto-bets]

## Transaction limits
- Users can "set limits on how much the agent can trade at a time." [secondary: Fortune, via Yahoo Finance] [source: https://ca.finance.yahoo.com/news/robinhood-just-rolled-trading-agents-230000312.html]

## Loops
- Loops (marked "coming soon") turn a strategy into a standing, ongoing instruction for the agent to execute on repeat, around the clock, without manual approval of each trade; the customer can turn it off at any time. [source: https://robinhood.com/us/en/newsroom/hood-summit-2026/]
- Robinhood's agentic trading page describes Agent Loops as scheduling agents to "research and trade continuously or on a schedule" (coming soon). [source: https://robinhood.com/us/en/agentic-trading/]
- Robinhood states it "does not guarantee how Loops will perform in any given market condition." [source: https://robinhood.com/us/en/newsroom/hood-summit-2026/]

## AI models and cost
- Customers choose a model "from several leading AI labs including OpenAI"; usage on OpenAI GPT-Luna is free until the end of the year (2026). [source: https://robinhood.com/us/en/newsroom/hood-summit-2026/]
- Models named at launch: OpenAI GPT-6 Luna, GPT-6 Sol, and Anthropic Opus 4.8; after the free period, standard token-based pricing from OpenAI and Anthropic applies. [secondary: Fortune, via Yahoo Finance] [source: https://ca.finance.yahoo.com/news/robinhood-just-rolled-trading-agents-230000312.html]

## Agent Apps (third-party data)
- Agent Apps are premium third-party data subscriptions for agents; every participating app has a one-month free trial; "coming soon to eligible U.S. customers." [source: https://robinhood.com/us/en/newsroom/hood-summit-2026/]
- Listed apps and monthly prices: Unusual Whales Options Trader $30/mo; Nasdaq Investor Intelligence $10/mo; SpotGamma Options Edge $10/mo; Wendy Market Interpreter $10/mo; Quiver Quantitative Government Tracking $10/mo; Token Terminal Crypto Fundamentals $10/mo; Visual Crossing Weather Trader $5/mo; SkyFi Satellite Intelligence $10/mo (coming soon); Narravance ChatterFlow $8/mo; Carbon Arc and Fiscal.ai (coming soon). [source: https://robinhood.com/us/en/newsroom/hood-summit-2026/]

## Asset classes
- Built-in and external agents can currently place long equities, options, and crypto orders. [source: https://robinhood.com/us/en/support/articles/trading-with-your-agent/]
- Agent order types: market (share-based), market (dollar-based), limit, stop limit, stop market. [source: https://robinhood.com/us/en/support/articles/trading-with-your-agent/]
- The agent can trade crypto but can't transfer, stake, or lend it; crypto trading through an agent isn't available in some states, including New York. [source: https://robinhood.com/us/en/support/articles/trading-with-your-agent/]
- At the May 27, 2026 launch, agentic trading covered equities only, with options, crypto, event contracts and futures described as coming soon. [source: https://robinhood.com/us/en/newsroom/robinhood-is-now-open-to-agents/]
- Crypto perpetual futures (announced alongside Agents, not an agent-only feature): BTC, ETH, SOL, XRP, DOGE, ADA, LINK, HYPE; up to 10x leverage on BTC and ETH perpetuals and 3x on everything else; fee of one basis point per trade (0.01%) through end of year; offered by Robinhood Derivatives through Bitstamp; "in the coming months" for eligible U.S. customers. [source: https://robinhood.com/us/en/newsroom/hood-summit-2026/]

## Availability and eligibility
- Robinhood Agents and Agent Apps: "coming soon to eligible U.S. customers"; Loops: "coming soon." [source: https://robinhood.com/us/en/newsroom/hood-summit-2026/]
- CoinDesk (Sep 30, 2026) reports the products are "still rolling out to eligible U.S. customers." [secondary: CoinDesk] [source: https://www.coindesk.com/markets/2026/09/30/robinhood-is-giving-customers-an-ai-agent-that-trades-for-them-plus-10x-crypto-bets]

## Risk disclosures
- "You assume all risk for trades executed by AI agents." [source: https://robinhood.com/us/en/newsroom/hood-summit-2026/]
- "Robinhood does not control, supervise, monitor, recommend, or audit agents." [source: https://robinhood.com/us/en/newsroom/hood-summit-2026/]
- CoinDesk reports customers also assume all risk for any use of their data by third-party LLM providers. [secondary: CoinDesk] [source: https://www.coindesk.com/markets/2026/09/30/robinhood-is-giving-customers-an-ai-agent-that-trades-for-them-plus-10x-crypto-bets]
- "Agentic trading involves significant risk, including the possible loss of your entire investment"; the customer is "ultimately responsible" for trades the agent places. [source: https://robinhood.com/us/en/support/articles/trading-with-your-agent/]
- Robinhood does not guarantee the accuracy, completeness, or suitability of agent output and is not responsible for losses from agent-generated decisions. [source: https://robinhood.com/us/en/support/articles/trading-with-your-agent/]
- AI agents "can make errors, misinterpret instructions, act on incomplete or outdated information, and may behave in unexpected ways." [source: https://robinhood.com/us/en/newsroom/robinhood-is-now-open-to-agents/]

## Usage stats
- Over 150,000 customers have opened agentic trading accounts (since the May 2026 launch), and agents use Robinhood's tools "almost 30 million times a day." [source: https://robinhood.com/us/en/newsroom/hood-summit-2026/]

## May 2026 agentic trading / MCP route (external agents)
- Robinhood launched Agentic Trading and an Agentic Credit Card on May 27, 2026, connecting third-party agents via its Model Context Protocol (MCP) servers. [source: https://robinhood.com/us/en/newsroom/robinhood-is-now-open-to-agents/]
- May launch guardrails: push notification for each trade, real-time activity feed and P&L in the app, disconnect at any time, optional manual approval. [source: https://robinhood.com/us/en/newsroom/robinhood-is-now-open-to-agents/]
- External agents trade from a "Robinhood MCP account," a self-directed individual investing account; a primary individual investing account in good standing is required; up to 10 self-directed individual investing accounts total, including the MCP account. [source: https://www.robinhood.com/us/en/support/articles/agentic-trading-overview/]
- MCP link: https://agent.robinhood.com/mcp/trading [source: https://www.robinhood.com/us/en/support/articles/agentic-trading-overview/]
- Listed platforms: Claude Code, Claude Desktop, ChatGPT, Codex, Codex CLI, Cursor, Grok, plus Perplexity, OpenClaw, Replit, AWS Quick, Poke and localhost. [source: https://www.robinhood.com/us/en/support/articles/agentic-trading-overview/]
- Setup steps: (1) connect the AI agent using the platform's instructions, (2) when authenticating, Robinhood prompts you to open an MCP account, (3) follow the on-screen steps. [source: https://www.robinhood.com/us/en/support/articles/agentic-trading-overview/]
- Claude Code: run `claude mcp add robinhood-trading --transport http https://agent.robinhood.com/mcp/trading`; Claude Desktop: Settings → Connectors → Add custom connector, add the MCP link; Codex CLI: `codex mcp add robinhood-trading --url https://agent.robinhood.com/mcp/trading`. [source: https://www.robinhood.com/us/en/support/articles/agentic-trading-overview/]
- ChatGPT: Settings → Security & login → turn on Developer Mode, then Plugins → + to add a new plugin with the MCP link. [source: https://www.robinhood.com/us/en/support/articles/agentic-trading-overview/]
- A connected agent gets read-only access to all the customer's Robinhood accounts (including account numbers), positions, balances and transaction/order history, but can only place trades in the Agentic account. [source: https://www.robinhood.com/us/en/support/articles/agentic-trading-overview/]

## Contested / unverified
- Eligibility scope: Fortune (via Yahoo) says all of Robinhood's roughly 29 million customers get access; Robinhood's newsroom says "coming soon to eligible U.S. customers" and CoinDesk says "still rolling out." Use Robinhood's wording.
- Exact model names (GPT-6 Luna / GPT-6 Sol / Opus 4.8) come only from Fortune; Robinhood's own page says "OpenAI GPT-Luna" and "several leading AI labs."
- Per-transaction limits: only secondary (Fortune) reports a user-set limit on how much the agent can trade at a time; no Robinhood page fetched states it.
- Benzinga (via Yahoo, Sep 29, 2026) describes the account as "ring-fenced"; this is outlet wording, not Robinhood's.
- CoinDesk's headline calls the agent "24/7"; Robinhood's stock market hours are Sun 8pm–Fri 8pm ET (weekend equities pending regulatory review), so 24/7 applies to crypto only.

## DO NOT STATE
- Any specific dollar amount or default value for per-transaction limits.
- Prices for the non-free models (GPT-6 Sol, Opus 4.8) or any Robinhood markup; none was published.
- Any Robinhood Gold requirement for Robinhood Agents (none found).
- A firm launch date for Loops, Agent Apps, or perpetual futures (only "coming soon" / "in the coming months").
- That agents can short, trade on margin, or trade futures/prediction markets (support page says long equities, options, crypto).
- Perpetual futures margin requirements or funding rates.
- ChatGPT step wording from third-party blogs ("Settings → Apps → Create app"); use Robinhood's wording above.

# CLOSED URL LIST
https://robinhood.com/us/en/newsroom/hood-summit-2026/
https://robinhood.com/us/en/support/articles/setting-up-an-agent/
https://robinhood.com/us/en/support/articles/trading-with-your-agent/
https://www.robinhood.com/us/en/support/articles/agentic-trading-overview/
https://robinhood.com/us/en/agentic-trading/
https://robinhood.com/us/en/newsroom/robinhood-is-now-open-to-agents/
https://www.coindesk.com/markets/2026/09/30/robinhood-is-giving-customers-an-ai-agent-that-trades-for-them-plus-10x-crypto-bets
https://ca.finance.yahoo.com/news/robinhood-just-rolled-trading-agents-230000312.html
https://finance.yahoo.com/markets/stocks/articles/robinhood-bets-ai-agents-trade-031744479.html


Anything not on this list, you do not know. Never invent a price, limit, rate, date, or URL; say it is unpublished and tell the reader to verify at the vendor page. Facts under 'Contested / unverified' must be presented as varying or unconfirmed; items under 'DO NOT STATE' must not appear.
