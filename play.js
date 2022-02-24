const axios = require('axios');

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
  let url = 'https://finnhub.io/api/v1/stock/financials-reported?token=c7talcqad3i8dq4tunfg&symbol='+symbol;
  let tData = await axios.get(url);
  tData = tData.data.data[0];

  function extract(stmt, item) {
    let arr = tData.report[stmt].filter(e => items[item].includes(e.concept));
    let uniques = [...new Map(arr.map(e => [e.concept, e])).values()];
    let tot = 0;
    uniques.forEach(i => {
      tot += isNaN(i.value/1e9) ? 0 : i.value/1e9;
    });
    return tot;
  }

  let obj = {
    ticker: tData.symbol,
    endDate: tData.endDate,
    shares: extract('ic', 'shrs'),
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

  return console.log(obj);
}

getInfo('hon');