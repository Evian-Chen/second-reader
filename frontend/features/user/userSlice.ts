import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { meApi } from "@/lib/api/me";
import type { UserDto, UpdateUserDto } from "@/lib/api/types";

export type UserState = {
  me: UserDto | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: UserState = {
  me: null,
  status: "idle",
  error: null,
};

export const fetchMe = createAsyncThunk(
  "user/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const data = await meApi.getMe();
      return data;
    } catch (e: unknown) {
      const err = e as { status?: number; message?: string };
      return rejectWithValue({
        status: err?.status,
        message: err?.message ?? "取得使用者資料失敗",
      });
    }
  }
);

export const updateMe = createAsyncThunk(
  "user/updateMe",
  async (body: UpdateUserDto) => {
    const data = await meApi.updateMe(body);
    return data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.me = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.me = action.payload ?? null;
        state.error = null;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        const status = (action.payload as { status?: number } | undefined)?.status;
        // 登出後或未授權時後端可能回 401/404，視為未登入即可，不顯示錯誤
        if (status === 401 || status === 404) {
          state.me = null;
          state.status = "idle";
          state.error = null;
          return;
        }
        state.status = "failed";
        state.error =
          (action.payload as { message?: string } | undefined)?.message ??
          action.error.message ??
          "取得使用者資料失敗";
      })
      .addCase(updateMe.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.me = action.payload ?? state.me;
        state.error = null;
      })
      .addCase(updateMe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "更新使用者資料失敗";
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
