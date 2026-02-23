// Displays list of related news articles
function NewsList({ news }) {
  if (!news || news.length === 0) return null;

  return (
    <div className="news-list">
      {news.map((article, index) => (
        <div key={index} className="news-card">

          {/* Optional image */}
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="news-image"
            />
          )}

          <div className="news-content">
            <h3>{article.title}</h3>

            {article.description && (
              <p>{article.description}</p>
            )}

            <div className="news-meta">
              <span>{article.source}</span>
              {article.publishedAt && (
                <span>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <a
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="news-link"
            >
              Read Full Article →
            </a>
          </div>

        </div>
      ))}
    </div>
  );
}

export default NewsList;