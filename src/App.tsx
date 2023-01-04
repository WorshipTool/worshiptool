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
import { createTheme } from '@mui/material';
import Sheet from './pages/Sheet/Sheet';

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
        {
          path:"song/:guid",
          element: <Sheet/>
        }
      ]
    },
    
  ]);

  const theme = createTheme({
    palette: {
      secondary: {
        main: "#ef476f",
      }
    },
  });
  
  
    return (
      <ThemeProvider theme={theme}>
        <RouterProvider router={router}/>
      </ThemeProvider>
    )
}

export default App;
