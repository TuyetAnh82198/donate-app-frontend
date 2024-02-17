import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import RootLayout from "./components/RootLayout";
import Add from "./pages/Add";
import HomePage from "./pages/HomePage";
import Page500 from "./pages/Page500";
import Update from "./pages/Update";
import Detail from "./pages/Detail";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Users from "./pages/Users";
import ChangePass from "./pages/ChangePass";
import PaymentCancel from "./pages/PaymentCancel";
import PaymentSuccess from "./pages/PaymentSuccess";
import History from "./pages/History";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "/add",
          element: <Add />,
        },
        { path: "/update/:id", element: <Update /> },
        { path: "/detail/:id", element: <Detail /> },
        { path: "/sign-up", element: <SignUp /> },
        { path: "/login", element: <Login /> },
        { path: "/users", element: <Users /> },
        { path: "/change-pass", element: <ChangePass /> },
        { path: "/payment-cancel", element: <PaymentCancel /> },
        { path: "/payment-success", element: <PaymentSuccess /> },
        { path: "/history", element: <History /> },
      ],
    },
    { path: "/server-error", element: <Page500 /> },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
