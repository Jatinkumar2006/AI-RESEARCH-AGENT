export const classifyQuery = (query) => {
  if (!query || typeof query !== "string") {
    return "general";
  }

  const financeKeywords = ["price", "rate", "gold", "stock", "market"];
  const lower = query.toLowerCase();

  if (financeKeywords.some(keyword => lower.includes(keyword))) {
    return "finance";
  }

  return "general";
};