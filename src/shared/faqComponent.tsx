import React, { useState, useRef, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import "@styles/faqComponent.css";

interface Props {
  question: string;
  answer: string;
}

/**
 * A component that renders the FAQ.
 * @param {Props} props The properties of the component.
 * @returns {JSX.Element} The component.
 */
const FaqComponent: React.FC<Props> = ({ ...props }) => {
  const [active, setActive] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current)
      contentRef.current.style.maxHeight = active
        ? `${contentRef.current.scrollHeight}px`
        : "0px";
  }, [contentRef, active]);

  const toggleAccordion = () => {
    setActive(!active);
  };
  return (
    <button className={`question-section ${active}`} onClick={toggleAccordion}>
      <div>
        <div className="question-align">
          <h4 className="question-style">{props.question}</h4>
          <FiPlus
            className={active ? "question-icon rotate" : "question-icon"}
          />
        </div>
        <div
          ref={contentRef}
          className={active ? "answer answer-divider" : "answer"}
        >
          <p>{props.answer}</p>
        </div>
      </div>
    </button>
  );
};

export default FaqComponent;
