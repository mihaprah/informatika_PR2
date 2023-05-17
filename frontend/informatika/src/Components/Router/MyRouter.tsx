import { RouterProvider } from "react-router"
import { createBrowserRouter } from "react-router-dom"
import TemplatePage from "../../Pages/TemplatePage"
import PageNotFound from "../../Pages/PageNotFound.tsx"
import HomeDay from "../../Pages/HomeDay.tsx";

export default function MyRouter () {
    const router = createBrowserRouter([
        {
          path: "/",
          element: <TemplatePage />,
          errorElement: <PageNotFound />,
          children: [
            {
                path: "/home-day",
                element: <HomeDay />
            }
          ]
        },
        {
          path: "/*",
          element: <PageNotFound/>,
        }
      
      ])

    return <RouterProvider router={router}/>
}


  