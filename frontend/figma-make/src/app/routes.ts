import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import MyShop from "./pages/MyShop";
import Orders from "./pages/Orders";
import BookDetail from "./pages/BookDetail";
import PostDetail from "./pages/PostDetail";
import Cart from "./pages/Cart";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "profile", Component: Profile },
      { path: "profile/:id", Component: Profile },
      { path: "my-shop", Component: MyShop },
      { path: "orders", Component: Orders },
      { path: "book/:id", Component: BookDetail },
      { path: "post/:id", Component: PostDetail },
      { path: "cart", Component: Cart },
    ],
  },
]);