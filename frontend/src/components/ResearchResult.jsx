import ReactMarkdown from "react-markdown";


// Displays structured AI result outside chat UI
function ResearchResult({ data }) {
  if (!data) return null;

  return (
    <div className="results">

      {/* Structured sections */}
      {data.aiResponse?.sections?.map((section, index) => (
        <div key={index} className="analysis-block">
          <h2>{section.title}</h2>
          <p>{section.content}</p>
        </div>
      ))}

      {/* Key Takeaways */}
      {data.aiResponse?.keyTakeaways?.length > 0 && (
        <>
          <h3>Key Takeaways</h3>
          <ul>
            {data.aiResponse.keyTakeaways.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </>
      )}

      {/* Recommendations */}
      {data.aiResponse?.recommendations?.length > 0 && (
        <>
          <h3>Recommendations</h3>
          <ul>
            {data.aiResponse.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </>
      )}

      {/* Sources */}
      {data.sources?.length > 0 && (
        <div className="sources">
          <h4>Sources</h4>
          {data.sources.map((s, i) => (
            <div key={i}>
              🔗{" "}
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.source} - {s.title}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResearchResult;