import React from 'react';
import { ThemeProvider, Typography } from '@mui/material';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home/Home';
import "./App.css";
import Base from './pages/Base';

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
      ]
    }
  ]);
  
    return (
      
      <RouterProvider router={router}/>
    )
}

export default App;
