// src/Services/GeminiService.js

// Lấy API Key từ biến môi trường
// Đảm bảo bạn đã tạo file .env và khởi động lại server dev
const GEMINI_API_KEY = "AIzaSyDPOgxBmNCmHvJQrGYcpwMJNHrqDiYY6KY";

// URL cơ sở của Gemini API cho mô hình gemini-pro (model phổ biến cho text)
const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Service để tương tác với Gemini API.
 */
export const geminiService = {
  /**
   * Gửi một yêu cầu tạo nội dung văn bản đến Gemini API.
   * @param {string} prompt Câu lệnh (prompt) bạn muốn gửi đến Gemini.
   * @returns {Promise<string>} Một Promise sẽ giải quyết thành chuỗi văn bản phản hồi từ Gemini,
   * hoặc reject nếu có lỗi.
   */
  generateContent: async (prompt) => {
    if (!GEMINI_API_KEY) {
      console.error("Lỗi: Không tìm thấy Gemini API Key. Vui lòng kiểm tra file .env");
      throw new Error("Gemini API Key không được cấu hình.");
    }

    try {
      const response = await fetch(`${GEMINI_API_BASE_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Lỗi từ Gemini API:", errorData);
        throw new Error(`Lỗi Gemini API: ${response.status} - ${errorData.error.message || 'Không rõ'}`);
      }

      const data = await response.json();
      // Gemini API trả về nội dung trong data.candidates[0].content.parts[0].text
      let jsonString = data.candidates[0]?.content?.parts[0]?.text || "Không có phản hồi hợp lệ.";
      // Debugging line
                return jsonString;

    } catch (error) {
      console.error("Lỗi khi gọi Gemini API:", error);
      throw error; // Ném lại lỗi để component gọi có thể xử lý
    }
  },


};
