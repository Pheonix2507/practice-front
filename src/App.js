import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

    const containerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "10vh",
        margin: 0,
        background: "linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)",
        fontFamily: "'Arial', sans-serif",
    };

    const textStyle = {
        fontSize: "4rem",
        fontWeight: "bold",
        color: "#ffffff",
        textShadow: "3px 3px 8px rgba(0, 0, 0, 0.7), -2px -2px 5px rgba(255, 255, 255, 0.3)",
        letterSpacing: "3px",
        textTransform: "uppercase",
        padding: "20px 40px",
        border: "3px solid rgba(255, 255, 255, 0.8)",
        borderRadius: "15px",
        background: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(8px)",
    };

const App = () => {
  // State to control the page
  const [startSurvey, setStartSurvey] = useState(false);

  // Initial set
  const initialQuestions = [
    {
      id: "satisfaction",
      question: "How satisfied are you with our products? (1-5)",
      type: "number",
      min: 1,
      max: 5,
    },
    {
      id: "fairness",
      question: "How fair are the prices compared to similar retailers? (1-5)",
      type: "number",
      min: 1,
      max: 5,
    },
    {
      id: "value",
      question: "How satisfied are you with the value for money of your purchase? (1-5)",
      type: "number",
      min: 1,
      max: 5,
    },
    {
      id: "recommendation",
      question:
        "On a scale of 1-10 how would you recommend us to your friends and family?",
      type: "number",
      min: 1,
      max: 10,
    },
    {
      id: "improvement",
      question: "What could we do to improve our service?",
      type: "text",
    },
  ];

  //store the questions
  const [questions, setQuestions] = useState(initialQuestions);

  //tracking responses
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  //new details questions
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    type: "text",
    min: "1",
    max: "5",
  });

  const handleNewQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  //add new questions
  const addQuestion = () => {
    if (!newQuestion.question.trim()) return; // Ensure the question is not empty
    const newQuestionObject = {
      id: `question-${questions.length + 1}`,
      ...newQuestion,
      min: newQuestion.type === "number" ? parseInt(newQuestion.min) || 1 : undefined,
      max: newQuestion.type === "number" ? parseInt(newQuestion.max) || 5 : undefined,
    };
    setQuestions((prevQuestions) => [...prevQuestions, newQuestionObject]);
    setNewQuestion({ question: "", type: "text", min: "", max: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResponses((prevResponses) => ({
      ...prevResponses,
      [name]: value,
    }));
  };

const nextStep = async () => {
  if (currentStep < questions.length - 1) {
    setCurrentStep((prevStep) => prevStep + 1);
  } else {
    setSubmitted(true);

    // Send responses to backend
    try {
      const response = await axios.post("http://localhost:5000/api/survey", {
        responses,
      });
      console.log("Survey submitted:", response.data);
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  }
};

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

//resetting after completing for a person
  const resetForm = () => {
    setResponses({});
    setCurrentStep(0);
    setSubmitted(false);
  };

  const handleStartSurvey = () => {
    setStartSurvey(true);
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setStartSurvey(false);  
        resetForm();  
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitted]);

  return (
    <div className="app">
      {!startSurvey ? (
        <div className="welcome-page">
          <h1>Welcome to Our Customer Survey</h1>
          <p>We value your feedback. Please click below to start the survey.</p>
          <button className="start-button" onClick={handleStartSurvey}>
            Start
          </button>
        </div>
      ) : (
        <div>
          {submitted ? (
            <div className="thank-you">
              <h2>Thank you for your feedback!</h2>
              <p>You will be redirected back to the welcome page shortly...</p>
              <button onClick={resetForm}>Submit Another Response</button>
            </div>
          ) : (
            <div>
                    <div style={containerStyle}>
            <h1 style={textStyle}>CODEINBOUND</h1>
        </div>
              {questions.length > 0 && currentStep < questions.length ? (
                <div className="question-card">
                  <p className="progress">
                    Question {currentStep + 1} of {questions.length}
                  </p>
                  <form>
                    <div className="form-group">
                      <label>{questions[currentStep].question}</label>
                      {questions[currentStep].type === "text" ? (
                        <textarea
                          name={questions[currentStep].id}
                          value={responses[questions[currentStep].id] || ""}
                          onChange={handleChange}
                          placeholder="Your answer..."
                        />
                      ) : (
                        <input
                          type={questions[currentStep].type}
                          name={questions[currentStep].id}
                          min={questions[currentStep].min}
                          max={questions[currentStep].max}
                          value={responses[questions[currentStep].id] || ""}
                          onChange={handleChange}
                          required
                        />
                      )}
                    </div>
                  </form>
                  <div className="navigation-buttons">
                    {currentStep > 0 && (
                      <button className="nav-button" onClick={prevStep}>
                        Previous
                      </button>
                    )}
                    <button className="nav-button" onClick={nextStep}>
                      {currentStep === questions.length - 1 ? "Submit" : "Next"}
                    </button>
                  </div>
                </div>
              ) : (
                <p>No questions available. Please add some questions.</p>
              )}
            </div>
          )}

          {!submitted && (
            <div className="add-question">
              <h2 className="pom">Add a New Question</h2>
              <div className="form-group">
                <label>Question Text</label>
                <textarea
                  name="question"
                  value={newQuestion.question}
                  onChange={handleNewQuestionChange}
                  placeholder="Enter your question here..."
                />
              </div>
              <div className="form-group">
                <label>Question Type</label>
                <select
                  name="type"
                  value={newQuestion.type}
                  onChange={handleNewQuestionChange}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                </select>
              </div>
              {newQuestion.type === "number" && (
                <div className="form-group">
                  <label>Min Value</label>
                  <input
                    type="number"
                    name="min"
                    value={newQuestion.min}
                    onChange={handleNewQuestionChange}
                    placeholder="Min value"
                  />
                  <label>Max Value</label>
                  <input
                    type="number"
                    name="max"
                    value={newQuestion.max}
                    onChange={handleNewQuestionChange}
                    placeholder="Max value"
                  />
                </div>
              )}
              <button className="add-button" onClick={addQuestion}>
                Add Question
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
