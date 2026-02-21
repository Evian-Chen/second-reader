import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/features/counter/counterSlice";
import bookReducer from "@/features/books/bookSlice";
import userReducer from "@/features/user/userSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      books: bookReducer,
      user: userReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
