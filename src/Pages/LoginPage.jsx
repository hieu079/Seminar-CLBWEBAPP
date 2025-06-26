import logo from "../assets/logo.png";

function LoginPage() {
    return (
        // Bố cục tổng thể: Nền xám nhạt, luôn chiếm toàn bộ chiều cao màn hình
        <div className="bg-gray-50 min-h-screen flex flex-col">
            {/* Phần Header: Logo và Tên thương hiệu */}
            <div className="flex items-center p-4 sm:p-6 ">
                <img className="w-1/12" src={logo} alt="Logo Cú chăm học" />
                <span className="ml-3 text-xl font-semibold text-gray-800">
                    Cú chăm học
                </span>
            </div>

            {/* Phần chính: Chứa form đăng nhập, căn giữa màn hình */}
            <div className="flex-grow flex items-center justify-center p-4">
                {/* Thẻ đăng nhập */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
                    {/* Tiêu đề */}
                    <div>
                        <p className="text-sm font-medium text-blue-600">LOGIN</p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                            Chào mừng trở lại!
                        </h1>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <input
                                placeholder="Tên đăng nhập hoặc Email"
                                className="border rounded-lg px-4 w-full py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                            />
                        </div>
                        <div>
                            <input
                                placeholder="Mật khẩu"
                                className="border rounded-lg px-4 w-full py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="password"
                            />
                        </div>
                    </div>

                    {/* Phần Ghi nhớ & Quên mật khẩu - Responsive */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Checkbox Ghi nhớ */}
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Ghi nhớ đăng nhập
                            </span>
                        </label>
                        {/* Link Quên mật khẩu */}
                        <p className="text-sm font-medium text-blue-600 hover:underline"> Quên mật khẩu?
                        </p>
                    </div>

                    {/* Nút Đăng nhập */}
                    <div>
                        <button className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Đăng nhập
                        </button>
                    </div>

                    {/* Link Đăng ký */}
                    <p className=' text-center m-2'>Bạn không có tài khoản <span className=" underline text-blue-500">Đăng ký ngay</span></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;