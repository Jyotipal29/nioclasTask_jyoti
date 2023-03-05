import { MathJax } from "better-react-mathjax";
import React from "react";

function SlideItem({ question, loading }) {
  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return <MathJax>{question}</MathJax>;
}

export default SlideItem;
