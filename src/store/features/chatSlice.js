import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../components/services/api";
// 🔹 Async action để fetch lịch sử tin nhắn từ API

export const fetchChatHistory = createAsyncThunk(
    "chat/fetchChatHistory",
    async ({adminId, userId}) => {
      
        const response = await api.get(`/chat/get-chat?adminId=${adminId}&userId=${userId}`);
        console.log("response", response);
        return response.data.data.messages; // Giả sử API trả về { messages: [...] }
    }
);
export const fetchUserChat = createAsyncThunk(
  "chat/fetchUserChat",
  async () => {
      const response = await api.get("/chat/history"); // Đúng endpoint để lấy lịch sử chat
      console.log("response", response);
      return response.data.data; // Giả sử API trả về { data: [...] }
  }
);





const chatSlice = createSlice({
    name: "chat",
    initialState: {
      conversations: [],

        messages: [],
        loading: false,
        error: null,
    },
    reducers: {
        addMessage: (state, action) => {
            console.log("🔍 Adding message:", action.payload); // Kiểm tra Redux nhận đúng data chưa

    
          
            state.messages.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChatHistory.fulfilled, (state, action) => {
                state.messages = action.payload;
                state.loading = false;
            })
            .addCase(fetchChatHistory.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })

            .addCase(fetchUserChat.fulfilled, (state, action) => {
              state.conversations = action.payload;
              state.loading = false;
          })
            
    },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
