import axios from "axios";
import "./App.css";
import { MathJaxContext } from "better-react-mathjax";
import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";

import SlideItem from "./components/SlideItem";

function App() {
  const [currentSlideIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([
    { questionId: "AreaUnderTheCurve_901", data: null, loading: false },
    { questionId: "BinomialTheorem_901", data: null, loading: false },
    { questionId: "DifferentialCalculus2_901", data: null, loading: false },
  ]);

  const loading = useMemo(() => slides.some((slide) => slide.loading), [
    slides,
  ]);

  async function getQuestionFromApi(questionId) {
    const url =
      "https://0h8nti4f08.execute-api.ap-northeast-1.amazonaws.com/getQuestionDetails/getquestiondetails";

    try {
      const { data } = await axios.get(url, {
        params: {
          QuestionID: questionId,
        },
      });

      const question = data[0];
      return question.Question;
    } catch (e) {
      return null;
    }
  }

  function updateSlideLoadingStatus(index, loadingStatus) {
    setSlides((slides) => {
      const slidesClone = [...slides];
      slidesClone[index].loading = !!loadingStatus;

      return slidesClone;
    });
  }

  async function loadIndex(index) {
    const metaData = slides[index];
    setCurrentIndex(index);

    // Only fetch question if its not yet loaded
    if (metaData.data) {
      return;
    }

    updateSlideLoadingStatus(index, true);
    const question = await getQuestionFromApi(metaData.questionId);
    updateSlideLoadingStatus(index, false);

    if (!question) {
      return;
    }

    setSlides((slides) => {
      const slidesClone = [...slides];
      slidesClone[index].data = question;

      return slidesClone;
    });
  }

  useEffect(() => {
    loadIndex(currentSlideIndex);
  }, []);

  return (
    <MathJaxContext>
      <div className="main-container">
        <div className="btn-container">
          <button
            className="btn"
            disabled={loading || currentSlideIndex === 0}
            onClick={() => loadIndex(currentSlideIndex - 1)}
          >
            Previous Question
          </button>
          <button
            className="btn"
            disabled={loading || currentSlideIndex === slides.length - 1}
            onClick={() => loadIndex(currentSlideIndex + 1)}
          >
            Next Question
          </button>
        </div>

        <div className="sub-container">
          {slides
            .filter((slide, index) => index === currentSlideIndex)
            .map((slide) => (
              <SlideItem
                key={slide.questionId}
                question={slide.data}
                loading={slide.loading}
              />
            ))}
        </div>
      </div>
    </MathJaxContext>
  );
}

export default App;
