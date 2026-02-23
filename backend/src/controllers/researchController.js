import { fetchNews } from "../services/newsService.js";
import { generateAIResponse } from "../services/aiService.js";
import { fetchWiki } from "../services/wikiService.js";
import { fetchGoldPrice } from "../services/financeService.js";
import { classifyQuery } from "../utils/queryClassifier.js";


// Main research controller
export const handleResearch = async (req, res) => {
  try {
    const { query } = req.body;

    // Basic input check
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Invalid query provided" });
    }

    const cleanQuery = query.trim();
    const type = classifyQuery(cleanQuery);

    let news = [];
    let wiki = "";
    let financeData = null;
    let sources = [];

    // #FINANCE MODE
    if (type === "finance") {
      financeData = await fetchGoldPrice();
    } else {
      const rawNews = await fetchNews(cleanQuery);

      // Break query into keywords for smarter filtering
      const keywords = cleanQuery.toLowerCase().split(" ").filter(Boolean);

      // Keep only articles that match at least one keyword
      news = rawNews
        .filter((article) => {
          const title = article.title?.toLowerCase() || "";
          const description = article.description?.toLowerCase() || "";

          return keywords.some(
            (word) => title.includes(word) || description.includes(word)
          );
        })
        .slice(0, 5) // limit to top 5 relevant articles
        .map((article) => ({
          title: article.title,
          source: article.source?.name,
          description: article.description,
          url: article.url,
          image: article.urlToImage,
          publishedAt: article.publishedAt,
        }));

      // Prepare clean source list for frontend
      sources = news.map((n) => ({
        title: n.title,
        source: n.source,
        url: n.url,
      }));

      // Fetch wikipedia summary if available
      wiki = await fetchWiki(cleanQuery);
    }

    // #BUILD AI CONTEXT
    // Give AI only clean structured data (not raw messy API response)
    const context = `
Recent News Articles:
${news.length > 0 ? JSON.stringify(news, null, 2) : "No relevant news found."}

Finance Data:
${financeData ? JSON.stringify(financeData, null, 2) : "Not applicable."}

Wikipedia Summary:
${wiki || "No Wikipedia summary available."}
    `;

    // Generate structured AI output
    const aiResponse = await generateAIResponse(cleanQuery, context);

    return res.json({
      success: true,
      query: cleanQuery,
      type,
      news,
      wiki,
      financeData,
      sources,
      aiResponse,
    });

  } catch (error) {
    console.error("Research Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};