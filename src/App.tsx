import React from 'react';
import { Box, ThemeProvider, Typography, styled } from '@mui/material';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home/Home';
import "./App.css";
import Create from './pages/Create/Create';
import { createTheme } from '@mui/material';
import Sheet from './pages/Sheet/Sheet';
import { AuthProvider } from './hooks/auth/useAuth';
import Account from './pages/Account/Account';
import TestPage from './pages/Test/TestPage';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import PlaylistPreview from './pages/Playlist/PlaylistPreview';
import { StackProvider } from './hooks/playlist/useStack';
import List from './pages/List/List';
import ErrorPage from './pages/ErrorPage/ErrorPage';


const Background = styled(Box)(({theme})=>({
  background: `linear-gradient(160deg, ${theme.palette.grey[200]}, ${theme.palette.grey[300]})`,
  position:"fixed",
  width:"100%",
  height:"100%",
  zIndex:-100,
  
}))

const router = createBrowserRouter([
  {
    path:"test",
    element: <TestPage/>,
    errorElement: <ErrorPage/>
  },
  {
    path:"/",
    element: <Home/>,
    errorElement: <ErrorPage/>
  },
  {
    path:"login",
    element: <Login/>,
    errorElement: <ErrorPage/>
  },
  {
    path:"account",
    element: <Account/>,
    errorElement: <ErrorPage/>
  },
  {
    path:"signup",
    element: <SignUp/>,
    errorElement: <ErrorPage/>
  },
  {
    path:"song/:guid",
    element: <Sheet/>,
    errorElement: <ErrorPage/>
  },
  {
    path: "create",
    element: <Create />,
    errorElement: <ErrorPage/>
  },
  {
    path: "create/:guid",
    element: <Create />,
    errorElement: <ErrorPage/>
  },
  {
    path: "playlist",
    element: <PlaylistPreview />,
    errorElement: <ErrorPage/>
  },
  {
    path: "list",
    element: <List />,
    errorElement: <ErrorPage/>
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

function App() {

    return (
      <SnackbarProvider maxSnack={1} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} autoHideDuration={3000}>        
        <ThemeProvider theme={theme}>
          <AuthProvider>      
              <StackProvider>
                <Background/>
                <RouterProvider router={router}/>
              </StackProvider>
          </AuthProvider>
        </ThemeProvider>
      </SnackbarProvider>
    )
}

export default App;
