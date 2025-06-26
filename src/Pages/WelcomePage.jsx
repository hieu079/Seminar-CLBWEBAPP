// src/Components/Pages/WelcomePage.jsx

import { useNavigate } from 'react-router-dom'; // Rất quan trọng: Import useNavigate hook
import logo from "../assets/logo.png"

function WelcomePage() {
  const navigate = useNavigate(); // Khởi tạo hook useNavigate để điều hướng

  const handleStartClick = () => {
    navigate('/SelectField');
  };

  return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">


      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 text-center mb-8">
        Bổ sung kiến thức mỗi ngày
      </h1>


      <div className="mb-12">

        <div className="w-48 h-48 sm:w-64 sm:h-64 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            <img className='w-sx' src={logo} alt="Logo" />
        </div>
      </div>
      <button
        onClick={handleStartClick}
        className="px-12 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xl rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        Bắt đầu
      </button>

         <p className="mt-8 text-lg sm:text-xl text-gray-600 text-center">
        Học mỗi ngày, tiến bộ mỗi ngày
      </p>

    </div>
  );
}

export default WelcomePage;
