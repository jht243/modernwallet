import { computeBiweekly } from "/home/user/modernwallet/src/lib/biweekly-mortgage.ts";
import { computeSalaryInflation } from "/home/user/modernwallet/src/lib/salary-inflation.ts";
import { pastToToday, CPI_12M_CHANGE_PCT } from "/home/user/modernwallet/src/lib/cpi-u.ts";
const b = computeBiweekly({ balance: 300000, ratePct: 6.5, yearsLeft: 30, setupFee: 395, perPaymentFee: 2.5 })!;
console.log(JSON.stringify({ pmt: b.monthlyPayment.toFixed(2), m: [b.monthly.payments, b.monthly.interest.toFixed(2)], bw: [b.biweekly.payments, b.biweekly.interest.toFixed(2)], x: [b.extraTwelfth.payments, b.extraTwelfth.interest.toFixed(2)], fees: b.fees, net: b.biweeklyNetSaving.toFixed(2) }));
const s = computeSalaryInflation({ pastSalary: 52000, pastYear: 2010, currentSalary: 78000 })!;
console.log(JSON.stringify({ adj: s.adjusted.toFixed(2), gap: s.gap!.toFixed(2), gapPct: s.gapPct!.toFixed(2), real: s.realChangePerYearPct!.toFixed(3), nom: s.nominalChangePerYearPct!.toFixed(3), keep: s.keepPaceRaise!.toFixed(2), pct: CPI_12M_CHANGE_PCT.toFixed(4) }));
console.log(JSON.stringify(pastToToday(100000, 2000)), JSON.stringify(pastToToday(1, 1913)), pastToToday(5, 1900));
