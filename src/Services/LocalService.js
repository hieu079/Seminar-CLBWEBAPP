// src/Services/LocalService.js

export const SELECTFIELDKEY = "selectfiasdfasdfeld"; // Key để lưu trong localStorage


export const localeSrvice = {
  /**
   * Lưu trữ giá trị vào localStorage với key SELECTFIELDKEY.
   * @param {string} value Giá trị cần lưu (thường là JSON string của mảng ID đã chọn).
   */
  setSelectFields: (value) => {
    try {
      localStorage.setItem(SELECTFIELDKEY, value);
      console.log("Dữ liệu đã lưu vào localStorage:", value);
      return true; // Trả về true nếu thành công
    } catch (e) {
      console.error("Lỗi khi lưu vào localStorage:", e);
      return false; // Trả về false nếu có lỗi
    }
  },

  /**
   * Lấy giá trị từ localStorage với key SELECTFIELDKEY.
   * @returns {string | null} Giá trị đã lưu, hoặc null nếu không tìm thấy/có lỗi.
   */
  getSelectFields: () => {
    try {
      const hi = localStorage.getItem(SELECTFIELDKEY);
      return hi;
    } catch (e) {
      console.error("Lỗi khi lấy từ localStorage:", e);
      return null;
    }
  },
};
