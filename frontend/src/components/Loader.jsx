// Simple animated loader component
function Loader({ text = "Thinking..." }) {
  return (
    <div className="loader">
      <div className="loader-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>{text}</p>
    </div>
  );
}

export default Loader;