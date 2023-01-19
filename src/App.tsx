import React from 'react';
import { Box, ThemeProvider, Typography, styled } from '@mui/material';
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
import { AuthProvider } from './hooks/auth/useAuth';
import Account from './pages/Account/Account';
import TestPage from './pages/Test/TestPage';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';


const Background = styled(Box)(({theme})=>({
  background: `linear-gradient(160deg, ${theme.palette.grey[200]}, ${theme.palette.grey[300]})`,
  position:"fixed",
  width:"100%",
  height:"100%",
  zIndex:-100,
  
}))

function App() {
  const router = createBrowserRouter([
    {
      path:"test",
      element: <TestPage/>,
      errorElement: <Typography>Error.</Typography>
    },
    {
      path:"/",
      element: <Home/>,
      errorElement: <Typography>Error.</Typography>
    },
    {
      path:"login",
      element: <Login/>,
      errorElement: <Typography>Error.</Typography>
    },
    {
      path:"account",
      element: <Account/>,
      errorElement: <Typography>Error.</Typography>
    },
    {
      path:"signup",
      element: <SignUp/>,
      errorElement: <Typography>Error.</Typography>
    },
    {
      path:"song/:guid",
      element: <Sheet/>,
      errorElement: <Typography>Error.</Typography>
    },
    {
      path: "create",
      element: <Create />,
      errorElement: <Typography>Error.</Typography>
    },
    
  ]);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#0085FF',
      },
      secondary: {
        main: "#F500AE",
      }

    },
  });
  
    return (
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Background/>
          <RouterProvider router={router}/>
        </AuthProvider>
      </ThemeProvider>
    )
}

export default App;
