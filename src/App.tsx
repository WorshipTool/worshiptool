import React from 'react';
import './App.css';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import { createBrowserRouter, Route } from 'react-router-dom';
import { Router, RouterProvider } from 'react-router';
import NotFoundScreen from './Screens/NotFoundScreen';
import SheetsScreen from './Screens/SheetsScreen/SheetsScreen';
import SheetContainer from './Screens/SheetsScreen/SheetContainer';

// import ReactDOM from 'react-dom';  
// import { Route, Link, BrowserRouter as Router } from 'react-router-dom'  

function App() {

  const customTheme = createTheme({
    palette: {
      primary: {
        main: "#F500AE",
      },
      secondary: {
        main: '#0085FF',
      },
      warning:{
        main: '#FFB800'
      }

    },
  });

  const router = createBrowserRouter([
  {
    path: "/:guid",
    element: <SheetsScreen />,
    errorElement: <NotFoundScreen />
  }
]);

  return (
    <ThemeProvider theme={customTheme}>
      <RouterProvider router={router}/>

    </ThemeProvider>
  )
}

export default App;
