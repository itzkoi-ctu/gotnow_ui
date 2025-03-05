import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "../../components/services/api"





// API lấy lịch sử chat
export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async ({ senderId, receiverId }) => {
    const response=await api.get(`/chats/history?senderId=${senderId}&receiverId=${receiverId}`)
    console.log("response from slice "+ JSON.stringify(response.data))
    return response.data;
  }
);

// API gửi tin nhắn
export const sendMessageDB = createAsyncThunk(
  "chat/sendMessage",
  async ({ senderId, receiverId, content }) => {
    const response = await api.post("/chats/send", {
      senderId,
      receiverId,
      content,
    });
    return response.data;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {}, // Nếu có các action đồng bộ, bạn có thể thêm ở đây
  extraReducers: (builder) => {
    builder
      // Lấy lịch sử tin nhắn
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Gửi tin nhắn
      .addCase(sendMessageDB.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export default chatSlice.reducer;
