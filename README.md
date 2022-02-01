# Simple Stock Valuation - Backend

**Author**: Polo Gonzalez

**Version**: 1.0.0

## Overview
Provides price and financial information for a group of stocks to allow the frontend app to build a meaningful valuation comparison for the relevant stocks.

## Getting Started
Dependencies on package.json (may use npm install / build)

## Architecture
Node express server with a MongoDB ablte to make axios calls to external APIs to retrieve updated price and financial information.

[Domain model](./domainModel.jpg)

### Database schema

**User profile**
- email: String,
- watchlist: [String]

**Stock**
- ticker: String,
- fy2021: { rev: Number, ebitda: Number, capex: Number, cash: Number, debt: Number},
- fy2020: { rev: Number, ebitda: Number, capex: Number, cash: Number, debt: Number},
- fy2019: { rev: Number, ebitda: Number, capex: Number, cash: Number, debt: Number}

## Change Log
2.1.2022 - Initial commit: set up, get and delete routes, connection to external API, initial README

## Credit and Collaborations
- Ryan Gallaway - instructor
- Riva Davidowski - TA
