import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../components/services/api";

// 🔹 Fetch lịch sử tin nhắn giữa Admin và User
export const fetchChatHistory = createAsyncThunk(
    "chat/fetchChatHistory",
    async ({ adminId, userId }) => {
        const response = await api.get(`/chat/get-chat?adminId=${adminId}&userId=${userId}`);
        return response.data.data.messages; // API trả về { messages: [...] }
    }
);

// 🔹 Fetch danh sách cuộc trò chuyện
export const fetchUserChat = createAsyncThunk(
    "chat/fetchUserChat",
    async () => {
        const response = await api.get("/chat/history"); // API lấy danh sách cuộc trò chuyện
        return response.data.data; // API trả về { data: [...] }
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
        // ✅ Cập nhật ngay `lastMessage` khi gửi tin nhắn mới
        addMessage: (state, action) => {
            console.log("🔍 Adding message:", action.payload);

            const { senderId, receiverId, content, timestamp } = action.payload;

            // ✅ Cập nhật tin nhắn vào danh sách
            state.messages.push(action.payload);

            // ✅ Cập nhật `lastMessage` trong `conversations`
            const conversation = state.conversations.find(
                (conv) => conv.userId === senderId || conv.userId === receiverId
            );

            if (conversation) {
                conversation.lastMessage = { senderId, receiverId, content, timestamp };
            }
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
            });
    },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
