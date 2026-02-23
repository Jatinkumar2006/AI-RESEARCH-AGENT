import axios from "axios";


// #FETCH NEWS ARTICLES
// Gets recent and relevant news articles for a topic
export const fetchNews = async (query) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      console.error("News API key missing");
      return [];
    }

    if (!query || typeof query !== "string") {
      return [];
    }

    const cleanQuery = query.trim();
     const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 15);

    const expandedQuery = `"${cleanQuery}" OR ${cleanQuery} diplomacy OR ${cleanQuery} trade OR ${cleanQuery} policy OR ${cleanQuery} government OR ${cleanQuery} meeting`;

    const response = await axios.get(
      "https://newsapi.org/v2/everything",
      {
        params: {
          q: expandedQuery,
          pageSize: 20,
          sortBy: "publishedAt",
          language: "en",
          from: fromDate.toISOString(),
          apiKey: apiKey,
        },
      }
    );

    const articles = response.data.articles || [];

    // Remove incomplete or useless articles
    const cleanedArticles = articles
      .filter(
        (a) =>
          a.title &&
          a.url &&
          a.publishedAt &&
          !a.title.toLowerCase().includes("[removed]")
      )
      .slice(0, 7); // limit final list

    return cleanedArticles;

  } catch (error) {
    console.error("News fetch error:", error.message);
    return [];
  }
};