import axios from "axios";


// #FETCH GOLD PRICE
// Gets latest gold price (XAUUSD) from Alpha Vantage
export const fetchGoldPrice = async () => {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_KEY;

    // If key missing, avoid useless API call
    if (!apiKey) {
      console.error("Alpha Vantage API key missing");
      return null;
    }

    const response = await axios.get(
      `https://www.alphavantage.co/query`,
      {
        params: {
          function: "GLOBAL_QUOTE",
          symbol: "XAUUSD",
          apikey: apiKey,
        },
      }
    );

    const quote = response.data["Global Quote"];

    // If API limit hit or invalid response
    if (!quote || !quote["05. price"]) {
      console.warn("Invalid gold price response");
      return null;
    }

    // Return clean structured data (not raw API format)
    return {
      symbol: quote["01. symbol"],
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      changePercent: quote["10. change percent"],
      lastTradingDay: quote["07. latest trading day"],
    };

  } catch (error) {
    console.error("Gold price fetch error:", error.message);
    return null;
  }
};