# API Reference for Swap Application

## Introduction

This document provides a reference for all available APIs in the Swap Application. These APIs allow users to fetch market data, manage portfolios, and perform token swaps.

---

## Endpoints

### 1. **Coingecko Token Market**

- **Endpoint**: `/api/coingecko/token/market`
- **Method**: `GET`
- **Description**: Fetches token market data including prices, market cap, volume, and liquidity.

#### Request
_No request parameters required._

#### Example Response
```json
{
  "tokens": [
    {
      "address": "0x12345",
      "name": "Ethereum",
      "symbol": "ETH",
      "price_usd": "1700.00",
      "market_cap_usd": "200000000000",
      "total_reserve_in_usd": "10000000000",
      "volume_usd": "2000000000",
      "logo": "https://example.com/logo.png"
    }
  ]
}
```

---

### 2. **Coingecko Portfolio**

- **Endpoint**: `/api/coingecko/portfolio`
- **Method**: `POST`
- **Description**: Fetches portfolio data for a given wallet address.

#### Request Body
```json
{
  "address": "0xYourWalletAddress",
  "chain": "0x1"
}
```

#### Example Response
```json
{
  "tokens": [
    {
      "token_address": "0x12345",
      "name": "Ethereum",
      "symbol": "ETH",
      "balance": "1.2345",
      "price": 1700,
      "logo": "https://example.com/logo.png"
    }
  ]
}
```

---

### 3. **Coingecko Token Price**

- **Endpoint**: `/api/coingecko/token/price`
- **Method**: `POST`
- **Description**: Fetches the price ratio between two tokens.

#### Request Body
```json
{
  "chainId": 1,
  "addressOne": "0xTokenOneAddress",
  "addressTwo": "0xTokenTwoAddress"
}
```

#### Example Response
```json
{
  "usdPrices": {
    "ratio": 0.0567
  }
}
```

---

### 4. **1Inch Allowance**

- **Endpoint**: `/api/1inch/allowance`
- **Method**: `POST`
- **Description**: Fetches the allowance for a token in a wallet.

#### Request Body
```json
{
  "token": "0xTokenAddress",
  "wallet": "0xWalletAddress"
}
```

#### Example Response
```json
{
  "data": {
    "allowance": "1000000000000000000"
  }
}
```

---

### 5. **1Inch Transaction**

- **Endpoint**: `/api/1inch/transaction`
- **Method**: `POST`
- **Description**: Creates a transaction for token approval.

#### Request Body
```json
{
  "token": "0xTokenAddress",
  "amount": "1.0"
}
```

#### Example Response
```json
{
  "data": {
    "to": "0xTransactionRecipient",
    "data": "0xTransactionData",
    "value": "0xTransactionValue"
  }
}
```

---

### 6. **1Inch Swap**

- **Endpoint**: `/api/1inch/swap`
- **Method**: `POST`
- **Description**: Executes a token swap.

#### Request Body
```json
{
  "fromTokenAddress": "0xTokenOneAddress",
  "toTokenAddress": "0xTokenTwoAddress",
  "amount": "1000000000000000000",
  "fromAddress": "0xYourWalletAddress",
  "slippage": 2.5
}
```

#### Example Response
```json
{
  "data": {
    "toTokenAmount": "567890000000000000",
    "tx": {
      "to": "0xTransactionRecipient",
      "data": "0xTransactionData",
      "value": "0xTransactionValue"
    }
  }
}
```
