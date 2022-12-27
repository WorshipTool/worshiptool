import React from 'react';
import { ThemeProvider, Typography } from '@mui/material';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home/Home';

function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element: <Home/>,
      errorElement: <Typography>Error.</Typography>
    }
  ]);
  
    return (
      
      <RouterProvider router={router}/>
    )
}

export default App;
