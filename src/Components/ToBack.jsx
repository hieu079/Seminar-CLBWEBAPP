// src/Components/Common/ToBack.jsx

import { useNavigate } from 'react-router-dom'; // Đảm bảo dòng này có mặt

/**
 * Component nút "Quay lại" để điều hướng đến một đường dẫn cụ thể hoặc quay lại một bước trong lịch sử.
 * @param {object} props - Các thuộc tính của component.
 * @param {string} props.targetPath - (Tùy chọn) Đường dẫn mà nút sẽ điều hướng đến. Nếu không được cung cấp, nó sẽ quay lại một bước trong lịch sử.
 */
function ToBack({ targetPath }) { // Đảm bảo targetPath được destructuring ở đây
  const navigate = useNavigate(); // Đảm bảo hook này được gọi trong component

  const handleBackClick = () => {
    // Sử dụng targetPath đã được destructuring
    if (targetPath) {
      navigate(targetPath); // Điều hướng đến đường dẫn cụ thể
    } else {
      navigate(-1); // Quay lại một bước trong lịch sử trình duyệt
    }
  };

  return (
    <button
      onClick={handleBackClick}
      className="absolute top-4 left-4 p-2 rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-100 transition duration-200 z-10"
      aria-label="Quay lại"
      title="Quay lại"
    >
      {/* Icon mũi tên trái sử dụng SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </button>
  );
}

export default ToBack;
