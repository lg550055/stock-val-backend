'use strict';
// this module obtains financial information from SEC filings for a given stock

const axios = require('axios');

// not all companies use the same tags to identify their financial information, thus the need to have multiple tags for the same financial metric
const items = {
  shrs: ['WeightedAverageNumberOfDilutedSharesOutstanding'],
  cash: ['CashAndCashEquivalentsAtCarryingValue','MarketableSecuritiesCurrent','ShortTermInvestments','CashCashEquivalentsAndShortTermInvestments','AvailableForSaleSecuritiesNoncurrent','MarketableSecuritiesNoncurrent','CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents','AvailableForSaleSecuritiesDebtSecuritiesCurrent','AvailableForSaleSecuritiesDebtSecuritiesNoncurrent','CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalentsIncludingDisposalGroupAndDiscontinuedOperations','DebtSecuritiesAvailableForSaleExcludingAccruedInterestCurrent'],
  debt: ['DebtCurrent','ShortTermBorrowings','CommercialPaper','LongTermDebt','LongTermDebtAndCapitalLeaseObligationsCurrent','LongTermDebtCurrent','LongTermDebtNoncurrent','LongTermDebtAndCapitalLeaseObligations','FinanceLeaseLiabilityCurrent','FinanceLeaseLiabilityNoncurrent'],
  rev: ['Revenues','RevenueFromContractWithCustomerExcludingAssessedTax'],
  ebit: ['OperatingIncomeLoss'],
  da: ['DepreciationDepletionAndAmortization','DepreciationAndAmortization','RestructuringCostsAndAssetImpairmentCharges','ResearchAndDevelopmentInProcess','ImpairmentOfIntangibleAssetsExcludingGoodwill','AssetImpairmentCharges','OtherDepreciationAndAmortization','Depreciation','GoodwillImpairmentLoss','AdjustmentForAmortization'],
  cfo: ['NetCashProvidedByUsedInOperatingActivities'],
  capex: ['PaymentsToAcquireProductiveAssets','PaymentsToAcquirePropertyPlantAndEquipment','nvda:PurchasesOfPropertyAndEquipmentAndIntangibleAssets']
};

async function getInfo (symbol) {
  // freq=quarterly (10q) or default annual (10k)
  const url = 'https://finnhub.io/api/v1/stock/financials-reported?token=c7talcqad3i8dq4tunfg&symbol='+symbol;
  let tData = await axios.get(url);
  tData = tData.data.data[0];

  const cik = tData.accessNumber.slice(0,10);
  const shrsUrl = `https://data.sec.gov/api/xbrl/companyconcept/CIK${cik}/dei/EntityCommonStockSharesOutstanding.json`;
  let sData = await axios.get(shrsUrl);
  sData = sData.data.units.shares[sData.data.units.shares.length - 1];
  const shrsOuts = sData.val/1e9;
  const soDate = sData.end;

  function extract(stmt, item) {
    let arr = tData.report[stmt].filter(e => items[item].includes(e.concept));
    let uniques = [...new Map(arr.map(e => [e.concept, e])).values()];
    let tot = 0;
    uniques.forEach(i => {
      tot += isNaN(i.value/1e9) ? 0 : i.value/1e9;
    });
    return tot;
  }

  // returns object to store in database or pass to frontend
  return {
    ticker: tData.symbol,
    cik: cik,
    shares: shrsOuts,
    soDate: soDate,
    endDate: tData.endDate,
    cash: extract('bs', 'cash'),
    debt: extract('bs', 'debt'),
    annual: [{
      fy: tData.year,
      endDate: tData.endDate,
      rev: extract('ic', 'rev'),
      ebit: extract('ic', 'ebit'),
      da: extract('cf', 'da'),
      cfo: extract('cf', 'cfo'),
      capex: extract('cf', 'capex')
    }]
  };
}

module.exports = getInfo;
