// src/Components/Pages/SelectField.jsx

import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import { localeSrvice } from '../Services/LocalService';
import { geminiService } from '../Services/GenminiCallService';
import ToBack from '../Components/ToBack';

function SelectField() {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [fetchedInterests, setFetchedInterests] = useState([]); // State mới cho danh mục từ Gemini
  const [loadingTopics, setLoadingTopics] = useState(true); // Trạng thái tải danh mục
  const [topicError, setTopicError] = useState(null); // Lỗi khi tải danh mục

  // useEffect để tải danh mục từ Gemini khi component mount
  useEffect(() => {
    const fetchTopicsFromGemini = async () => {
      setLoadingTopics(true);
      setTopicError(null);
      try {
        const prompt = `
        Tạo một danh sách 20 danh mục 
        giáo dục đa dạng và thú vị phù hợp 
        cho một bài kiểm tra kiến thức tổng quát.
         Phản hồi dưới dạng JSON array của các chuỗi. 
         Mỗi chuỗi phải là tên một danh mục đơn lẻ. 
         Ví dụ: [{text:"Lịch sử",id:....,icon:là hình emoji tương ứng},...]`;

        const responseSchema = {
          type: "ARRAY",
          items: {
            type: "STRING"
          }
        };

 let result = await geminiService.generateContent(prompt, {
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });
 result = result.replace(/```json\s*([\s\S]*?)\s*```/, '$1').trim();

                result = result.trim(); // Loại bỏ khoảng trắng và ký tự xuống dòng ở đầu/cuối
                if (result.startsWith('"') && result.endsWith('"')) {
                    // Nếu chuỗi vẫn còn bắt đầu và kết thúc bằng dấu nháy kép, loại bỏ chúng.
                    // Điều này xử lý trường hợp phản hồi có thể là: "[...]" hoặc "\n"[...]"\n"
                    result = result.substring(1, result.length - 1);
                }
                // Sau khi loại bỏ dấu nháy kép, cần trim lại một lần nữa để chắc chắn
                result = result.trim();

                console.log("Chuỗi JSON sau khi làm sạch cuối cùng (trước parse):", result); // Debugging line
                
               result = JSON.parse(result);

        if (Array.isArray(result) && result.length > 0) {
          // Chuyển đổi định dạng thành mảng đối tượng phù hợp với cấu trúc hiện tại
          const formattedTopics = result.map((topic, index) => ({
            id: topic.id, // Tạo ID từ tên topic
            text: topic.text,
            icon: topic.icon, // Có thể dùng icon ngẫu nhiên hoặc icon cố định
            // Các màu nền mẫu, bạn có thể tạo hàm random màu sắc nếu muốn đa dạng hơn
            bgColor: ['bg-orange-50', 'bg-blue-50', 'bg-yellow-50', 'bg-green-50'][(index % 4)],
            iconBgColor: ['bg-orange-200', 'bg-blue-200', 'bg-yellow-200', 'bg-green-200'][(index % 4)]
          }));
          setFetchedInterests(formattedTopics);
        } else {
          setTopicError("Gemini không tạo được danh mục hoặc phản hồi không đúng định dạng.");
          setFetchedInterests([]); // Đảm bảo fetchedInterests là rỗng
        }
      } catch (e) {
        console.error("Lỗi khi lấy danh mục từ Gemini:", e);
        setTopicError("Không thể tải danh mục từ Gemini. Vui lòng thử lại sau.");
        setFetchedInterests([]); // Đảm bảo fetchedInterests là rỗng
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopicsFromGemini();
  }, []); // [] đảm bảo useEffect chỉ chạy một lần khi component mount

  const handleInterestClick = (interest) => { // Tham số là toàn bộ đối tượng interest
    setSelectedInterests((prevSelected) => {
      if (prevSelected.includes(interest.text)) { // So sánh dựa trên text
        return prevSelected.filter((item) => item !== interest.text);
      } else {
        return [...prevSelected, interest.text]; // Lưu text vào selectedInterests
      }
    });
  };

  const handleContinueClick = () => {
    // Lưu các lĩnh vực đã chọn vào localStorage
    localeSrvice.setSelectFields(JSON.stringify(selectedInterests));
    navigate("/ConFigPrompt"); // Điều hướng tới trang cấu hình prompt
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 ">
      <div className='m-5'><ToBack targetPath="/home"></ToBack></div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-10 text-center">
        Kiến thức yêu thích
      </h1>

      {loadingTopics ? (
        <div className="text-gray-600 text-lg">Đang tải danh mục...</div>
      ) : topicError ? (
        <div className="text-red-600 bg-red-100 p-4 rounded-lg w-full max-w-sm text-center">
          {topicError}
        </div>
      ) : fetchedInterests.length === 0 ? (
        <div className="text-gray-600 p-4 rounded-lg w-full max-w-sm text-center">
          Không có danh mục nào được tải.
        </div>
      ) : (
        <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 space-y-4  pb-40 ">
          {fetchedInterests.map((interest) => ( // Sử dụng fetchedInterests
            <div
              key={interest.id}
              className={`
                flex items-center p-4 rounded-lg cursor-pointer border
                transition duration-200 ease-in-out
                ${interest.bgColor}
                ${selectedInterests.includes(interest.text) // Kiểm tra dựa trên text
                  ? 'border-red-500 shadow-inner'
                  : 'border-transparent hover:shadow-md'
                }
              `}
              onClick={() => handleInterestClick(interest)} // Truyền toàn bộ đối tượng interest
            >
              {/* Icon hoặc Emoji */}
              <span
                className={`
                  text-3xl mr-4 p-2 rounded-lg flex items-center justify-center w-12 h-12
                  ${interest.iconBgColor}
                `}
              >
                {interest.icon}
              </span>
              {/* Tên kiến thức */}
              <span className="text-lg font-medium text-gray-700">
                {interest.text}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleContinueClick}
        // Vô hiệu hóa nút nếu đang tải danh mục hoặc không có danh mục nào được chọn
        disabled={loadingTopics || selectedInterests.length === 0}
        className={`
          fixed zIndex-50 bottom-10
          mt-10 px-12 py-4 rounded-full text-white font-semibold text-xl shadow-lg
          transition duration-300 ease-in-out transform hover:scale-105
          ${loadingTopics || selectedInterests.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}
        `}
      >
        Tiếp tục
      </button>
    </div>
  );
}

export default SelectField;
