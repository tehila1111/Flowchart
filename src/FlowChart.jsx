import React, { useState } from 'react';

const FlowChart = () => {
  const [answers, setAnswers] = useState({
    newBuilding: null,
    buildingType: null,
    // מגורים
    hasMinUnits: null,
    hasMinFloors: null,
    withinHeightLimitResidential: null,
    // מבנה ציבור
    isHospitalOrHostel: null,
    isLargerThan100sqm: null,
    withinHeightLimitPublic: null,
    // משרדים, מסחר, אחסנה - להוספה בעתיד
  });
  
  const [currentQuestion, setCurrentQuestion] = useState('newBuilding');
  const [showResult, setShowResult] = useState(false);
  
  const buildingTypes = [
    { value: 'residential', label: 'מגורים' },
    { value: 'public', label: 'מבנה ציבור' },
    { value: 'office', label: 'משרדים' },
    { value: 'commercial', label: 'מסחר' },
    { value: 'storage', label: 'אחסנה' }
  ];
  
  const questions = {
    newBuilding: {
      text: "האם הבניה המתוכננת הינה בניה חדשה שנקלטה לאחר ה-1.1.2025?",
      nextIfYes: "buildingType",
      nextIfNo: "end",
      type: "yesNo"
    },
    buildingType: {
      text: "מהו פלח הבניה המתוכננת?",
      next: {
        'residential': "hasMinUnits",
        'public': "isHospitalOrHostel",
        'office': "end",
        'commercial': "end",
        'storage': "end"
      },
      type: "select"
    },
    // מסלול מגורים
    hasMinUnits: {
      text: "האם הבניה כוללת לפחות 6 יח\"ד?",
      nextIfYes: "hasMinFloors",
      nextIfNo: "end",
      type: "yesNo"
    },
    hasMinFloors: {
      text: "האם מתוכננות 2 קומות לפחות?",
      nextIfYes: "withinHeightLimitResidential",
      nextIfNo: "end",
      type: "yesNo"
    },
    withinHeightLimitResidential: {
      text: "האם המבנה מתוכנן עד לגובה מקסימלי של 42 מטר?",
      nextIfYes: "result",
      nextIfNo: "end",
      type: "yesNo"
    },
    // מסלול מבנה ציבור
    isHospitalOrHostel: {
      text: "האם המבנה המתוכנן הינו בית חולים או מעון לפי חוק הפיקוח על המעונות?",
      nextIfYes: "end",
      nextIfNo: "isLargerThan100sqm",
      type: "yesNo"
    },
    isLargerThan100sqm: {
      text: "האם המבנה מתוכנן בשטח שמעל 100 מ\"ר?",
      nextIfYes: "withinHeightLimitPublic",
      nextIfNo: "end",
      type: "yesNo"
    },
    withinHeightLimitPublic: {
      text: "האם המבנה מתוכנן עד לגובה 29 מטר?",
      nextIfYes: "result",
      nextIfNo: "end",
      type: "yesNo"
    }
  };
  
  const handleSelectAnswer = (question, value) => {
    const newAnswers = { ...answers, [question]: value };
    setAnswers(newAnswers);
    
    const nextQuestion = questions[question].next[value];
    if (nextQuestion === "result") {
      setShowResult(true);
    } else if (nextQuestion !== "end") {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
    }
  };
  
  const handleYesNoAnswer = (question, answer) => {
    const newAnswers = { ...answers, [question]: answer };
    setAnswers(newAnswers);
    
    if (answer) {
      const nextQuestion = questions[question].nextIfYes;
      if (nextQuestion === "result") {
        setShowResult(true);
      } else if (nextQuestion !== "end") {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowResult(true);
      }
    } else {
      const nextQuestion = questions[question].nextIfNo;
      if (nextQuestion !== "end") {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowResult(true);
      }
    }
  };
  
  const resetFlow = () => {
    setAnswers({
      newBuilding: null,
      buildingType: null,
      hasMinUnits: null,
      hasMinFloors: null,
      withinHeightLimitResidential: null,
      isHospitalOrHostel: null,
      isLargerThan100sqm: null,
      withinHeightLimitPublic: null
    });
    setCurrentQuestion('newBuilding');
    setShowResult(false);
  };
  
  const checkRequiresInspection = () => {
    // מסלול מגורים
    if (
      answers.newBuilding === true && 
      answers.buildingType === 'residential' && 
      answers.hasMinUnits === true && 
      answers.hasMinFloors === true && 
      answers.withinHeightLimitResidential === true
    ) {
      return true;
    }
    
    // מסלול מבנה ציבור - שאינו בית חולים או מעון
    if (
      answers.newBuilding === true &&
      answers.buildingType === 'public' &&
      answers.isHospitalOrHostel === false &&
      answers.isLargerThan100sqm === true &&
      answers.withinHeightLimitPublic === true
    ) {
      return true;
    }
    
    return false;
  };
  
  const renderQuestion = (questionKey) => {
    const question = questions[questionKey];
    
    if (question.type === "yesNo") {
      return (
        <div className="p-4 mb-4 bg-light rounded shadow-sm" dir="rtl">
          <h2 className="h5 mb-4">{question.text}</h2>
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => handleYesNoAnswer(questionKey, true)}
              className="btn btn-success"
            >
              כן
            </button>
            <button
              onClick={() => handleYesNoAnswer(questionKey, false)}
              className="btn btn-danger"
            >
              לא
            </button>
          </div>
        </div>
      );
    } else if (question.type === "select") {
      return (
        <div className="p-4 mb-4 bg-light rounded shadow-sm" dir="rtl">
          <h2 className="h5 mb-4">{question.text}</h2>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {buildingTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleSelectAnswer(questionKey, type.value)}
                className="btn btn-primary"
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  const renderResult = () => {
    const requiresInspection = checkRequiresInspection();
    
    return (
      <div className="p-4 mb-4 bg-light rounded shadow-sm text-center" dir="rtl">
        {requiresInspection ? (
          <div className="alert alert-warning">
            <h2 className="h4">המבנה נדרש למכון בקרה</h2>
          </div>
        ) : (
          <div className="alert alert-info">
            <h2 className="h4">המבנה אינו נדרש למכון בקרה</h2>
          </div>
        )}
        <button
          onClick={resetFlow}
          className="btn btn-primary mt-3"
        >
          התחל מחדש
        </button>
      </div>
    );
  };
  
  const getPathDisplay = () => {
    const path = [];
    
    // Add first question
    if (answers.newBuilding !== null) {
      path.push({
        question: questions.newBuilding.text,
        answer: answers.newBuilding ? 'כן' : 'לא',
        status: answers.newBuilding ? 'positive' : 'negative'
      });
    }
    
    // Add building type question
    if (answers.buildingType) {
      const buildingTypeLabel = buildingTypes.find(t => t.value === answers.buildingType)?.label;
      path.push({
        question: questions.buildingType.text,
        answer: buildingTypeLabel,
        status: 'neutral'
      });
      
      // מסלול מגורים
      if (answers.buildingType === 'residential') {
        if (answers.hasMinUnits !== null) {
          path.push({
            question: questions.hasMinUnits.text,
            answer: answers.hasMinUnits ? 'כן' : 'לא',
            status: answers.hasMinUnits ? 'positive' : 'negative'
          });
        }
        
        if (answers.hasMinFloors !== null) {
          path.push({
            question: questions.hasMinFloors.text,
            answer: answers.hasMinFloors ? 'כן' : 'לא',
            status: answers.hasMinFloors ? 'positive' : 'negative'
          });
        }
        
        if (answers.withinHeightLimitResidential !== null) {
          path.push({
            question: questions.withinHeightLimitResidential.text,
            answer: answers.withinHeightLimitResidential ? 'כן' : 'לא',
            status: answers.withinHeightLimitResidential ? 'positive' : 'negative'
          });
        }
      }
      
      // מסלול מבנה ציבור
      if (answers.buildingType === 'public') {
        if (answers.isHospitalOrHostel !== null) {
          path.push({
            question: questions.isHospitalOrHostel.text,
            answer: answers.isHospitalOrHostel ? 'כן' : 'לא',
            status: answers.isHospitalOrHostel ? 'positive' : 'negative'
          });
        }
        
        if (answers.isLargerThan100sqm !== null) {
          path.push({
            question: questions.isLargerThan100sqm.text,
            answer: answers.isLargerThan100sqm ? 'כן' : 'לא',
            status: answers.isLargerThan100sqm ? 'positive' : 'negative'
          });
        }
        
        if (answers.withinHeightLimitPublic !== null) {
          path.push({
            question: questions.withinHeightLimitPublic.text,
            answer: answers.withinHeightLimitPublic ? 'כן' : 'לא',
            status: answers.withinHeightLimitPublic ? 'positive' : 'negative'
          });
        }
      }
    }
    
    return path;
  };

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">מכונת קביעת דרישות לבניה חדשה</h1>
      {!showResult ? (
        <div>{renderQuestion(currentQuestion)}</div>
      ) : (
        renderResult()
      )}
      {getPathDisplay().length > 0 && (
        <div className="mt-4">
          <h2 className="h5 mb-3">תהליך קבלת החלטה:</h2>
          <ul className="list-group">
            {getPathDisplay().map((step, index) => (
              <li key={index} className={`list-group-item list-group-item-${step.status}`}>
                <strong>{step.question}</strong>
                <p>{step.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FlowChart;
