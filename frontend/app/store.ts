import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/features/counter/counterSlice";
import bookReducer from "@/features/books/bookSlice";
import userReducer from "@/features/user/userSlice";
import { baseApi } from "@/features/api/baseApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      books: bookReducer,
      user: userReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
