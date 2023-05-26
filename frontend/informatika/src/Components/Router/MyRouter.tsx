import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import TemplatePage from "../../Pages/TemplatePage";
import PageNotFound from "../../Pages/PageNotFound.tsx";
import HomeDay from "../../Pages/HomeDay.tsx";
import Login from "../../Pages/Login.tsx";
import SignUp from "../../Pages/SignUp.tsx";
import HomeMonth from "../../Pages/HomeMonth.tsx";
import HomeYear from "../../Pages/HomeYear.tsx";
import Comparison from "../../Pages/Comaprison.tsx";
import CabinetHistory from "../../Pages/CabinetHistory.tsx";
import UserProfile from "../../Pages/UserProfile.tsx";
import {useState} from "react";

export default function MyRouter() {
  const [cabinetID, setCabinetID] = useState("5-001");

  const handleChange = (id: string) => {
    setCabinetID(id);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <TemplatePage />,
      errorElement: <PageNotFound />,
      children: [
        {
          path: "/home-day",
          element: <HomeDay cabinetID={cabinetID} />,
          errorElement: <PageNotFound />,
        },
        {
          path: "/home-month",
          element: <HomeMonth cabinetID={cabinetID}/>,
          errorElement: <PageNotFound />,
        },
        {
          path: "/home-year",
          element: <HomeYear cabinetID={cabinetID}/>,
          errorElement: <PageNotFound />,
        },
        {
          path: "/comparison",
          element: <Comparison cabinetID={cabinetID}/>,
          errorElement: <PageNotFound />,
        },
        {
          path: "/history",
          element: <CabinetHistory cabinetID={cabinetID}/>,
          errorElement: <PageNotFound />,
        },
        {
          path: "/user-profile",
          element: <UserProfile onChange={handleChange} cabinetID={cabinetID}/>,
          errorElement: <PageNotFound />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/*",
      element: <PageNotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
}
