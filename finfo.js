'use strict';
// this module obtains financial information from SEC filings for a given stock

const axios = require('axios');

// not all companies use the same tags to identify their financial information, thus the need to have multiple tags for the same financial metric
const key = {
  s: ['WeightedAverageNumberOfDilutedSharesOutstanding'],
  c: ['CashAndCashEquivalentsAtCarryingValue','MarketableSecuritiesCurrent','ShortTermInvestments','CashCashEquivalentsAndShortTermInvestments','AvailableForSaleSecuritiesNoncurrent','MarketableSecuritiesNoncurrent','CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents','AvailableForSaleSecuritiesDebtSecuritiesCurrent','AvailableForSaleSecuritiesDebtSecuritiesNoncurrent'],
  dst: ['DebtCurrent','ShortTermBorrowings','CommercialPaper','UnsecuredDebtCurrent','LongTermDebtAndCapitalLeaseObligationsCurrent','LongTermDebtCurrent'],
  dlt: ['LongTermDebt','LongTermDebtNoncurrent','UnsecuredLongTermDebt','LongTermDebtAndCapitalLeaseObligations','LongTermNotesPayable'],
  r: ['Revenues','RevenueFromContractWithCustomerExcludingAssessedTax'],
  gp: ['GrossProfit'],
  o: ['OperatingIncomeLoss'],
  dna: ['Depreciation','DepreciationAndAmortization','DepreciationDepletionAndAmortization','DepreciationAmortizationAndAccretionNet','OtherDepreciationAndAmortization','AmortizationOfIntangibleAssets','AssetImpairmentCharges','ResearchAndDevelopmentAssetAcquiredOtherThanThroughBusinessCombinationWrittenOff','Amortizationofintangibleandrightofuseassets','ImpairmentOfIntangibleAssetsExcludingGoodwill','ResearchAndDevelopmentInProcess'],
  cfo: ['NetCashProvidedByUsedInOperatingActivities'],
  cpx: ['PaymentsToAcquireProductiveAssets','PaymentsToAcquirePropertyPlantAndEquipment','PaymentsToAcquireOtherPropertyPlantAndEquipment']
};

async function getFinInfo (symbol) {
  // freq=quarterly (10q) or default annual (10k)
  let url = 'https://finnhub.io/api/v1/stock/financials-reported?token=c7talcqad3i8dq4tunfg&symbol='+symbol;
  let tData = await axios.get(url);
  tData = tData.data.data[0];

  // returns object to store in database or pass to frontend
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
