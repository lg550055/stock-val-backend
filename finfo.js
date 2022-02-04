'use strict';

const axios = require('axios');

const key = {
  s: ['WeightedAverageNumberOfDilutedSharesOutstanding'],
  c: ['CashAndCashEquivalentsAtCarryingValue','MarketableSecuritiesCurrent','ShortTermInvestments','CashCashEquivalentsAndShortTermInvestments','AvailableForSaleSecuritiesNoncurrent'],
  dst: ['DebtCurrent','ShortTermBorrowings','LongTermDebtAndCapitalLeaseObligationsCurrent','LongTermDebtCurrent'],
  dlt: ['LongTermDebtNoncurrent','LongTermDebtAndCapitalLeaseObligations'],
  r: ['Revenues','RevenueFromContractWithCustomerExcludingAssessedTax'],
  gp: ['GrossProfit'],
  o: ['OperatingIncomeLoss'],
  cfo: ['NetCashProvidedByUsedInOperatingActivities'],
  cpx: ['PaymentsToAcquireProductiveAssets','PaymentsToAcquirePropertyPlantAndEquipment']
};

async function getFinInfo (symbol) {
  let url = 'https://finnhub.io/api/v1/stock/financials-reported?token=c7talcqad3i8dq4tunfg&symbol='+symbol;
  let tData = await axios.get(url);
  tData = tData.data.data[0];

  return {
    ticker: tData.symbol,
    endDate: tData.endDate,
    shares: tData.report.ic.filter(e => key.s.includes(e.concept))[0].value/1e6,
    kItems: [
      {
        endDate: tData.endDate,
        revenue: tData.report.ic.filter(e => key.r.includes(e.concept))[0].value/1e9,
        gprofit: tData.report.ic.filter(e => key.gp.includes(e.concept))[0] ? tData.report.ic.filter(e => key.gp.includes(e.concept))[0].value/1e9 : null,
        cfo: tData.report.cf.filter(e => key.cfo.includes(e.concept))[0].value/1e9,
        capex: tData.report.cf.filter(e => key.cpx.includes(e.concept))[0].value/1e9
      }
    ]
  };
}

module.exports = getFinInfo;
