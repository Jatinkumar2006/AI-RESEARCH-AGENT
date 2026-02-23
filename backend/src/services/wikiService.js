import axios from "axios";

// #FETCH WIKIPEDIA SUMMARY
export const fetchWiki = async (query) => {
  try {
    if (!query) return "";

    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent": "AI-Research-Agent/1.0 (student project)"
        }
      }
    );

    return response.data.extract || "";

  } catch (error) {
    console.warn("Wiki fetch skipped:", error.message);
    return "";
  }
};