import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { booksApi } from "@/lib/api/books";
import type {
  UserBookSummaryDto,
  GetBooksParams,
  SearchBooksParams,
} from "@/lib/api/types";

export type BookState = {
  list: UserBookSummaryDto[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: BookState = {
  list: [],
  status: "idle",
  error: null,
};

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (params?: GetBooksParams) => {
    const data = await booksApi.getBooks(params);
    return data;
  }
);

export const searchBooks = createAsyncThunk(
  "books/searchBooks",
  async (params?: SearchBooksParams) => {
    const data = await booksApi.searchBooks(params);
    return Array.isArray(data) ? data : [data];
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearBooks: (state) => {
      state.list = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload ?? [];
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "取得書籍失敗";
      })
      .addCase(searchBooks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload ?? [];
        state.error = null;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "搜尋書籍失敗";
      });
  },
});

export const { clearBooks } = bookSlice.actions;
export default bookSlice.reducer;
