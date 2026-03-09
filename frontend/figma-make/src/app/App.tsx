import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    document.title = "黑白冊 Second Reader - 二手書交易交換平台";
  }, []);

  return <RouterProvider router={router} />;
}