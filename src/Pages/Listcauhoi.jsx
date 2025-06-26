// src/Components/Pages/Listcauhoi.jsx

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { geminiService } from '../Services/GenminiCallService';

function Listcauhoi({ questions, onClose, onClearQuestions, onRegenerateQuiz }) {
  const navigate = useNavigate();
  const questionRefs = useRef([]);

  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');
  const [rewardLoading, setRewardLoading] = useState(false);
  const [rewardError, setRewardError] = useState(null);

  if (!questions || questions.length === 0) {
    return null;
  }

  const handleScrollToQuestion = (questionIndex) => {
    const element = questionRefs.current[questionIndex];
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    if (!showResults) {
      setSelectedAnswers(prevAnswers => {
        const newAnswers = [...prevAnswers];
        newAnswers[questionIndex] = answerIndex;
        return newAnswers;
      });
    }
  };

  const handleSubmitQuiz = async () => {
    let currentScore = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswerIndex) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setShowResults(true);

    setRewardLoading(true);
    setRewardError(null);
    setRewardMessage('');

    const prompt = `Người dùng đã hoàn thành một bài kiểm tra trắc nghiệm với ${currentScore} trên tổng số ${questions.length} câu hỏi. Hãy tạo một lời khen thưởng hoặc động viên ngắn gọn, mang tính cảm xúc (dưới 30 từ) để chúc mừng họ.`;

    try {
      const message = await geminiService.generateContent(prompt);

      // *** START: TÍNH NĂNG MỚI - LÀM SẠCH CHUỖI ***
      // Loại bỏ khoảng trắng thừa và dấu ngoặc kép ở đầu/cuối chuỗi
      const cleanedMessage = message.trim().replace(/^"|"$/g, '');
      setRewardMessage(cleanedMessage);
      // *** END: TÍNH NĂNG MỚI ***

    } catch (err) {
      setRewardError("Không thể tạo lời khen thưởng.");
      console.error("Lỗi khi tạo lời khen thưởng từ Gemini:", err);
    } finally {
      setRewardLoading(false);
      setShowRewardPopup(true);
    }
  };

  const getAnswerClassNames = (questionIndex, answerIndex) => {
    const isSelected = selectedAnswers[questionIndex] === answerIndex;
    const isCorrect = answerIndex === questions[questionIndex].correctAnswerIndex;

    if (!showResults) {
      return isSelected ? 'bg-blue-200 border-blue-500' : 'bg-gray-50 hover:bg-gray-100';
    } else {
      if (isCorrect) {
        return 'bg-green-100 text-green-800 font-medium border-green-500';
      } else if (isSelected && !isCorrect) {
        return 'bg-red-100 text-red-800 font-medium border-red-500';
      } else {
        return 'bg-gray-50 text-gray-700 border-gray-200';
      }
    }
  };

  const handlePlayAgain = () => {
    setShowRewardPopup(false);
    onClearQuestions();
    onRegenerateQuiz();
  };

  const handleChooseDifferentTopic = () => {
    setShowRewardPopup(false);
    onClearQuestions();
    navigate('/SelectField');
  };

  const handleReviewQuiz = () => {
    setShowRewardPopup(false);
  };

  const unansweredQuestionNumbers = [];
  if (!showResults) {
    selectedAnswers.forEach((answer, index) => {
      if (answer === null) {
        unansweredQuestionNumbers.push(index + 1);
      }
    });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl 
      max-h-[90vh] overflow-y-auto relative transform scale-95 opacity-0 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl 
          font-bold p-1 rounded-full transition duration-200"
          aria-label="Đóng"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Danh sách câu hỏi
        </h2>

        {showResults && (
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-center font-semibold text-xl mb-6">
            Bạn đã trả lời đúng {score} / {questions.length} câu hỏi!
          </div>
        )}

        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              ref={(el) => (questionRefs.current[qIndex] = el)}
              className="border-b pb-4 last:border-b-0 scroll-mt-4"
            >
              <p className="font-semibold text-lg text-gray-800 mb-2">
                Câu {qIndex + 1}: ({q.topic}) {q.question}
              </p>
              <ul className="space-y-2">
                {q.answers.map((answer, aIndex) => (
                  <li
                    key={aIndex}
                    className={`p-2 rounded-md border cursor-pointer transition duration-150 ease-in-out
                                ${getAnswerClassNames(qIndex, aIndex)}`}
                    onClick={() => handleAnswerSelect(qIndex, aIndex)}
                  >
                    {String.fromCharCode(65 + aIndex)}. {answer}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {!showResults && unansweredQuestionNumbers.length > 0 && (
          <div className="mt-6 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-center font-medium">
            Bạn chưa trả lời các câu: {' '}
            {unansweredQuestionNumbers.map((qNumber, index) => (
              <span key={qNumber}>
                <button
                  onClick={() => handleScrollToQuestion(qNumber - 1)}
                  className="font-bold text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  {qNumber}
                </button>
                {index < unansweredQuestionNumbers.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
          {!showResults && (
            <button
              onClick={handleSubmitQuiz}
              disabled={selectedAnswers.includes(null)}
              className={`
                px-8 py-3 rounded-full text-white font-semibold shadow-lg transition duration-300 ease-in-out transform hover:scale-105
                ${selectedAnswers.includes(null) ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}
              `}
            >
              Nộp bài
            </button>
          )}

          <button
            onClick={() => {
              onClearQuestions();
              setShowRewardPopup(false);
              setRewardMessage('');
              setRewardError(null);
            }}
            className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Xóa dữ liệu
          </button>
        </div>
      </div>

      {showRewardPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center relative transform scale-95 opacity-0 animate-scale-in">

            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Hoàn thành!
            </h3>

            <div className="my-4">
              <p className="text-lg text-gray-600">Kết quả của bạn</p>
              <p className="text-6xl font-bold text-blue-600">
                {score}<span className="text-4xl text-gray-500">/{questions.length}</span>
              </p>
            </div>

            <div className="mt-4 p-3 bg-gray-100 rounded-lg min-h-[60px] flex items-center justify-center">
              {rewardLoading ? (
                <p className="text-gray-600 text-sm italic">Đang tải lời nhắn...</p>
              ) : rewardError ? (
                <p className="text-red-500 text-sm">{rewardError}</p>
              ) : (
                // *** START: TÍNH NĂNG MỚI - CẬP NHẬT JSX ***
                // Bỏ dấu "" bao quanh {rewardMessage}
                <p className="text-gray-800 text-lg font-style: italic font-medium whitespace-pre-wrap">{rewardMessage}</p>
                // *** END: TÍNH NĂNG MỚI ***
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={handleReviewQuiz}
                className="col-span-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full shadow-md transition duration-200"
              >
                Xem lại bài làm
              </button>
              <button
                onClick={handlePlayAgain}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition duration-200"
              >
                Chơi lại
              </button>
              <button
                onClick={handleChooseDifferentTopic}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-md transition duration-200"
              >
                Chủ đề khác
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{` {value.toString()}
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default Listcauhoi;