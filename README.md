# Simple Stock Valuation - Backend

**Author**: Polo Gonzalez

**Version**: 1.0.0

## Overview
Provides price and financial information of a group of stocks.  This information helps the frontend app build a simple but meaningful valuation comparison for the selected stocks.

## Motivation
Most financial websites provide valuations based on p/e (price to earnings).  While a decent proxy, p/e has important limitations.  For example, it mostly ignores the capital structure of the business and is distorted by non-cash items.  Most sophisticaded investors use total enterprise value to ebitda or ebitda minus capex.  This method, which is what we use in this app, fully captures the capital sturcture of the business and avoids distortions caused by non-cash items.  We believe it would be helpful to have these metrics available on a website.

## Getting Started
- Dependencies on package.json
- Use `npm install` to install dependencies
- Then `npm start` to run

## Architecture
Node express server with a MongoDB. Server makes axios calls to external APIs to retrieve updated price and financial information.

[Domain model](./domainModel.jpg)

### Database schema

**User profile**  *(upcoming feature)*
- email: String,
- watchlist: [ String ]

**Stock**
- ticker - stock symbol
- cik - SEC identifier
*Most recent data*
- shares - number of shares outstanding
- cash - cash and marketable securities
- debt - total debt
- endData - date of most recent financial data
*Most recent FY financials*
  - revenue
  - ebitda
  - cash from operations
  - capex

## Credit and Collaborations
- Ryan Gallaway - instructor
- Riva Davidowski - TA
