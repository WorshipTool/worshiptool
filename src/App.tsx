import React from 'react';
import { ThemeProvider, Typography } from '@mui/material';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home/Home';
import "./App.css";
import Base from './pages/Base';
import Create from './pages/Create/Create';

function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element: <Base/>,
      errorElement: <Typography>Error.</Typography>,
      children: [
        {
          path: "",
          element: <Home />
        },
        {
          path: "create",
          element: <Create />
        },
      ]
    }
  ]);
  
    return (
      
      <RouterProvider router={router}/>
    )
}

export default App;
