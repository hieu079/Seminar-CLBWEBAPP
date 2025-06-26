// src/Routers/index.js
import SelectField from "../Pages/SelectField";
import WelcomePage from "../Pages/WelcomePage";
import ConFigPrompt from "../Pages/ConFigPrompt";
import LoginPage from "../Pages/LoginPage";
// Import thêm các component cho các trang khác nếu có
// import HomePage from "../Pages/HomePage"; // Ví dụ

export const routes = [
  {
    path: "/",
    // Truyền tham chiếu đến component, KHÔNG phải thể hiện JSX
    component: WelcomePage,
  },
  {
    // Thêm một route cho trang đích khi nhấn nút "Bắt đầu"
    path: "/home", // Ví dụ: bạn có thể thay đổi thành '/dashboard' hoặc bất kỳ route nào khác
    component: WelcomePage, // Thay thế bằng component thực tế của trang Home/Dashboard của bạn
  },
  {
    path:"/SelectField",
    component: SelectField,
  },
  {
    path: "/ConFigPrompt",
    component: ConFigPrompt,
  },
  {
    path:"/LoginPage",
    component: LoginPage,
  },

  // Thêm các route khác của bạn ở đây
];
