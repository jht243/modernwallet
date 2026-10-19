# Output contract
Return ONE JSON object (a ModernWallet `RoundupEntry`) with exactly these keys, in this order:
slug, title, metaDescription, targetKeyword, category, angle, h1, introText, rankingCriteria, options, comparisonTable, verdict, sections, faqs, sources, relatedComparisons, calculatorLinks.
- title 50-65 chars; metaDescription 140-155 chars; angle = "best"; category = "healthcare directive services".
- introText: 2-3 short paragraphs separated by \n\n. The first paragraph answers the reader question in its first sentence. Second paragraph begins "At ModernWallet, we ..." (one brand first-person "we", only what the experience file allows).
- options: one per vendor in the fact list, in the order given, each {name, bestFor, description, strengths[3-4], limitations[2-3], pricing}. Facts only from the fact list.
- comparisonTable: headers ["Service","Price","What's included","Attorney access","Best for"]; rows = every vendor, {name, values[4]} (values answer the 4 headers after Service). Each value <= 15 words.
- sections: 3 sections {heading, content}, noun-phrase headings: "Living will vs. healthcare power of attorney"; "Signing and witness rules"; "When a lawyer is the better route". content may contain markdown links ONLY to the internal routes listed in the prompt.
- faqs: 5 {question, answer} using the questions in the prompt.
- sources: [{label,url}] only from the closed URL list.
- relatedComparisons: slugs from the prompt; calculatorLinks: from the prompt.
- No rankings by popularity, no "best overall" claims we cannot back: use "best for ..." framing. No legal or medical advice; no promise of outcomes.
- The page never mentions ModernWallet as a listed option and never says anything about paid placement.
