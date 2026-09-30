## Robinhood Agents: The In-App AI Traders Announced September 29, 2026

Robinhood Agents are automated AI assistants built directly into the Robinhood mobile app that research markets, propose strategies, and execute orders through a dedicated, separately funded account. That built-in system differs fundamentally from the external agentic trading route Robinhood launched in May 2026, which connects third-party AI models like ChatGPT, Claude, and Codex through Robinhood's Model Context Protocol (MCP) server with trade confirmations turned off by default.

Robinhood announced the in-app agents on September 29, 2026, at its [HOOD Summit '26](https://robinhood.com/us/en/newsroom/hood-summit-2026/) conference in Houston. The feature is coming soon to eligible U.S. customers, and [CoinDesk](https://www.coindesk.com/markets/2026/09/30/robinhood-is-giving-customers-an-ai-agent-that-trades-for-them-plus-10x-crypto-bets) reported the following day that access is still rolling out rather than available to the entire user base immediately.

Every built-in agent operates strictly inside its own dedicated account. The agent can only touch the cash you transfer into that specific balance from a linked bank account or an existing Robinhood balance, leaving your primary portfolio untouched. Customers must have an open primary Robinhood individual investing account in good standing, can run only one built-in agent at a time, and must manage the agent through the mobile app because web access offers limited usability according to Robinhood's [agent setup documentation](https://robinhood.com/us/en/support/articles/setting-up-an-agent/).

Trade approvals serve as the primary safeguard for built-in agents, defaulting to on during setup. When approvals stay on, the agent analyzes market data and drafts orders, but you must manually review and submit every trade in the mobile app. By contrast, external MCP accounts default to autonomous execution with approvals turned off. Even when you switch approvals off on a built-in agent, Robinhood notes that certain sensitive orders still trigger manual confirmation prompts. State regulations also override user settings: residents in California and Connecticut must keep trade approvals on for all cryptocurrency orders placed through built-in agents.

For recurring strategies, Robinhood introduced an upcoming automation feature called Loops. According to Robinhood's [agentic trading portal](https://robinhood.com/us/en/agentic-trading/), Loops will schedule an agent to research and trade on a continuous loop around the clock without manual trade approvals. You can pause loops or disconnect the agent at any time, and Robinhood states plainly in its summit materials that it does not guarantee how Loops will perform in any given market condition. If you run automated strategies across overnight sessions, review our guide to [Robinhood 24-hour trading](/guides/robinhood-24-hour-trading/) to understand order fills during extended market hours.

Robinhood states that users select models from several leading AI labs including OpenAI, with usage of OpenAI GPT-Luna provided for free through the end of 2026. Beyond GPT-Luna, [Fortune](https://ca.finance.yahoo.com/news/robinhood-just-rolled-trading-agents-230000312.html) reported that launch options include GPT-6 Sol and Anthropic Opus 4.8, with standard token rates applying once promotional periods end. Robinhood has not published specific token pricing for those alternative models.

Built-in agents can trade long equities, options, and cryptocurrencies using market orders, dollar-based market orders, limit orders, stop limit orders, and stop market orders. Robinhood's support page does not list short selling or margin among agent capabilities, and an agent cannot transfer, stake, or lend crypto. Agent crypto trading also remains unavailable in several jurisdictions, including New York state. Frequent automated rebalancing can create unexpected tax friction, so check our breakdown of the [wash-sale rule explained](/guides/wash-sale-rule-explained/) before deploying high-frequency strategies. Robinhood also announced crypto perpetual futures with up to 10x leverage on Bitcoin and Ether alongside Agents, but those contracts are an upcoming derivatives product from Bitstamp, not a tool for AI agents.

To feed market data into these bots, Robinhood introduced Agent Apps, which are paid third-party intelligence subscriptions that each include a one-month free trial. Available add-ons include Unusual Whales Options Trader for $30 a month, Nasdaq Investor Intelligence for $10 a month, and Visual Crossing Weather Trader for $5 a month.

To set up a built-in Robinhood Agent:

1. Open the Robinhood mobile app and tap the Agents tab at the top of the screen.
2. Enter a custom name for your agent.
3. Review and sign the account agreement and the agentic trading agreement.
4. Open the dedicated agent account and transfer an initial cash deposit.
5. Confirm that trade approvals remain toggled on to require manual order confirmation.
6. Select your underlying AI model.

If you prefer using an external model on your desktop, you can connect through the [Robinhood MCP trading server](https://www.robinhood.com/us/en/support/articles/agentic-trading-overview/) in three steps:

1. Add Robinhood's MCP link (`https://agent.robinhood.com/mcp/trading`) to your AI client. For Claude Code, run `claude mcp add robinhood-trading --transport http https://agent.robinhood.com/mcp/trading`.
2. Authenticate with your Robinhood credentials when prompted to create an individual MCP investing account.
3. Complete the on-screen risk acknowledgments and fund the separate account.

Because autonomous software can misinterpret prompts, fund this dedicated balance strictly with capital you can afford to lose. Connected external agents receive read-only access to all your Robinhood accounts, including balances, account numbers, and transaction records, even though their trading execution is restricted to the agent account.

Robinhood requires users to accept substantial legal disclaimers before enabling automation. The company notes in its newsroom disclosures: "You assume all risk for trades executed by AI agents." A second mandatory disclosure states: "Robinhood does not control, supervise, monitor, recommend, or audit agents." For a wider evaluation of account custody, SIPC limits, and institutional protections, see our review of [is Robinhood safe](/guides/is-robinhood-safe/).

Adoption has expanded rapidly since early testing began. Robinhood reports that over 150,000 customers have opened agentic accounts since the initial May launch, with automated systems calling Robinhood tools nearly 30 million times each day.