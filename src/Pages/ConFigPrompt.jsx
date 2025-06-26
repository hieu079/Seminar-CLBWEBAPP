// src/Components/Pages/ConFigPrompt.jsx

import React, { useState, useEffect } from 'react';
import Listcauhoi from './Listcauhoi'; // Import component Listcauhoi mới
import { localeSrvice } from '../Services/LocalService';
import { geminiService } from '../Services/GenminiCallService';
import ToBack from '../Components/ToBack';


function ConFigPrompt() { 

  const [soCauHoi, setSoCauHoi] = useState(10);
  const [doKho, setDoKho] = useState("dễ");
  const [danhSachLinhVuc, setDanhSachLinhVuc] = useState([]);
  const [selectedTopicDisplay, setSelectedTopicDisplay] = useState('Lịch sử');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showSoCauHoiInput, setShowSoCauHoiInput] = useState(false);
  const [showDoKhoSelect, setShowDoKhoSelect] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  useEffect(() => {
    const rawLinhVuc = localeSrvice.getSelectFields();
    if (rawLinhVuc) {
      try {
        const parsedLinhVuc = JSON.parse(rawLinhVuc);
        if (Array.isArray(parsedLinhVuc) && parsedLinhVuc.length > 0) {
          setDanhSachLinhVuc(parsedLinhVuc);
          setSelectedTopicDisplay(parsedLinhVuc.join(", "));
        } else {
          setDanhSachLinhVuc(['Chưa chọn lĩnh vực']);
          setSelectedTopicDisplay('Chưa chọn lĩnh vực');
        }
      } catch (e) {
        console.error("Lỗi khi parse danh sách lĩnh vực từ localStorage:", e);
        setDanhSachLinhVuc(['Lỗi tải lĩnh vực']);
        setSelectedTopicDisplay('Lỗi tải lĩnh vực');
      }
    } else {
      setDanhSachLinhVuc(['Chưa chọn lĩnh vực']);
      setSelectedTopicDisplay('Chưa chọn lĩnh vực');
    }
  }, []);

  const handleSoCauHoiChange = (e) => {
    setSoCauHoi(parseInt(e.target.value) || 0);
  };

  const handleDoKhoChange = (e) => {
    setDoKho(e.target.value);
  };

  // Hàm này chỉ còn nhiệm vụ xóa dữ liệu câu hỏi và lỗi
  const handleClearQuestions = () => {
    setQuestions([]);
    setError(null);
    setLoading(false);
    // Lưu ý: showQuestionModal sẽ được quản lý bởi Listcauhoi hoặc ConFigPrompt khi gọi Listcauhoi
    console.log("Dữ liệu câu hỏi đã được xóa.");
  };

  const xulyTaoCauHoi = async () => {
    if (danhSachLinhVuc.length === 0 || danhSachLinhVuc[0] === 'Chưa chọn lĩnh vực' || danhSachLinhVuc[0] === 'Lỗi tải lĩnh vực') {
      setError("Vui lòng chọn lĩnh vực yêu thích trước khi tạo câu hỏi.");
      return;
    }
    if (soCauHoi <= 0) {
        setError("Số câu hỏi phải lớn hơn 0.");
        return;
    }

    setLoading(true);
    setError(null);
    setQuestions([]);
    setShowQuestionModal(false); // Đảm bảo modal đóng trước khi tạo mới

    const linhVucString = danhSachLinhVuc.join(', ');

    const responseSchema = {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          topic: { "type": "STRING" },
          question: { "type": "STRING" },
          answers: {
            "type": "ARRAY",
            "items": { "type": "STRING" }
          },
          correctAnswerIndex: { "type": "NUMBER" } // 0-indexed
        },
        required: ["topic", "question", "answers", "correctAnswerIndex"]
      }
    };

    const prompt = `Tạo một danh sách ${soCauHoi} câu hỏi trắc nghiệm về các lĩnh vực sau: ${linhVucString}. Mỗi câu hỏi có độ khó "${doKho}". Mỗi câu hỏi phải có 4 lựa chọn đáp án và chỉ rõ đáp án đúng (từ 0 đến 3). Phân chia câu hỏi đều cho các lĩnh vực đã cho. Định dạng phản hồi dưới dạng JSON Array, mỗi đối tượng trong mảng có cấu trúc: { "topic": "tên lĩnh vực", "question": "nội dung câu hỏi", "answers": ["đáp án A", "đáp án B", "đáp án C", "đáp án D"], "correctAnswerIndex": số_index_đáp_án_đúng_ (0,1,2,3) }.`;

    try {
    let result = await geminiService.generateContent(prompt, {
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });
 result = result.replace(/```json\s*([\s\S]*?)\s*```/, '$1').trim();
                
                // Bước 2: Loại bỏ các dấu nháy kép thừa ở đầu và cuối chuỗi (nếu có)
                // và các ký tự trắng/newline còn sót lại.
                result = result.trim(); // Loại bỏ khoảng trắng và ký tự xuống dòng ở đầu/cuối
                if (result.startsWith('"') && result.endsWith('"')) {
                    // Nếu chuỗi vẫn còn bắt đầu và kết thúc bằng dấu nháy kép, loại bỏ chúng.
                    // Điều này xử lý trường hợp phản hồi có thể là: "[...]" hoặc "\n"[...]"\n"
                    result = result.substring(1, result.length - 1);
                }
                // Sau khi loại bỏ dấu nháy kép, cần trim lại một lần nữa để chắc chắn
                result = result.trim();

                
               result = JSON.parse(result);
      if (Array.isArray(result)) {
        setQuestions(result);
        if (result.length > 0) {
            setShowQuestionModal(true); // Hiển thị modal sau khi có câu hỏi
        }
        console.log("Câu hỏi đã tạo:", result);
      } else {
        setError("Phản hồi từ Gemini không đúng định dạng JSON mong muốn hoặc không phải mảng.");
        console.error("Phản hồi Gemini không phải mảng:", result);
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tạo câu hỏi. Vui lòng thử lại.");
      console.error("Lỗi gọi Gemini API:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4 font-inter">
    <div className='m-5'><ToBack targetPath="/SelectField"></ToBack></div>
      <div className="w-full max-w-sm flex items-center justify-center pt-8 pb-4">
        {/* Icon (có thể thay bằng icon thực tế nếu có) */}
        <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mr-4">
          <span className="text-4xl" role="img" aria-label="book">📚</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 text-center">{selectedTopicDisplay}</h2>
      </div>

      {/* Phần Cấu hình */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 mt-8 space-y-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Cấu hình</h3>


        {/* Mục Số câu hỏi */}
        <div
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200"
          onClick={() => setShowSoCauHoiInput(!showSoCauHoiInput)}
        >
          <span className="text-lg font-medium text-gray-700">Số câu hỏi</span>
          <div className="flex items-center">
            <span className="text-lg text-gray-600 mr-2">{soCauHoi}</span>
            <span className="text-xl text-gray-500">›</span> {/* Mũi tên */}
          </div>
        </div>
        {showSoCauHoiInput && (
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            placeholder="Nhập số câu hỏi"
            value={soCauHoi}
            onChange={handleSoCauHoiChange}
            min="1"
          />
        )}

        {/* Mục Độ khó */}
        <div
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200"
          onClick={() => setShowDoKhoSelect(!showDoKhoSelect)}
        >
          <span className="text-lg font-medium text-gray-700">Độ khó</span>
          <div className="flex items-center">
            <span className="text-lg text-gray-600 mr-2">{doKho}</span>
            <span className="text-xl text-gray-500">›</span> {/* Mũi tên */}
          </div>
        </div>
        {showDoKhoSelect && (
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            value={doKho}
            onChange={handleDoKhoChange}
          >
            <option value="dễ">Dễ</option>
            <option value="trung bình">Trung bình</option>
            <option value="khó">Khó</option>
          </select>
        )}
      </div>

      {/* Nút Bắt đầu */}
      <button
        onClick={xulyTaoCauHoi}
        disabled={loading}
        className={`
          mt-10 px-12 py-4 rounded-full text-white font-semibold text-xl shadow-lg
          transition duration-300 ease-in-out transform hover:scale-105
          ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}
        `}
      >
        {loading ? 'Đang tạo câu hỏi...' : 'Bắt đầu'}
      </button>

      {/* Hiển thị lỗi */}
      {error && (
        <div className="mt-8 text-red-600 bg-red-100 p-4 rounded-lg w-full max-w-lg text-center">
          {error}
        </div>
      )}

      {/* Render component Listcauhoi nếu showQuestionModal là true */}
      {showQuestionModal && (
        <Listcauhoi
          questions={questions}
          onClose={() => setShowQuestionModal(false)}
          onClearQuestions={handleClearQuestions}
          onRegenerateQuiz={xulyTaoCauHoi} // Truyền hàm tạo câu hỏi xuống Listcauhoi
        />
      )}
    </div>
  );
}

export default ConFigPrompt;
