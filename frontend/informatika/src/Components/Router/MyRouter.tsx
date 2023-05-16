import { RouterProvider } from "react-router"
import { createBrowserRouter } from "react-router-dom"
import TemplatePage from "../../Pages/TemplatePage"
import PageNotFound from "../PageNotFound/PageNotFound"

export default function MyRouter () {
    const router = createBrowserRouter([
        {
          path: "/",
          element: <TemplatePage />,
          errorElement: <PageNotFound />,
          children: [
            {
                path: "",
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


  