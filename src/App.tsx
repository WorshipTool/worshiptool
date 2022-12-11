import React from 'react';
import SearchScreen from './SearchScreen';
import './App.css';
import SheetScreen2 from './Screens/SheetScreen2';
import HomeScreen from './Screens/Home/HomeScreen';
import { ThemeProvider } from '@emotion/react';
import { blue, blueGrey, purple } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import AddSongScreen from './Screens/AddSong/AddSongScreen';
import { createBrowserRouter, Route } from 'react-router-dom';
import { Router, RouterProvider } from 'react-router';
import NotFoundScreen from './Screens/NotFoundScreen';
import SheetsScreen from './Screens/SheetsScreen/SheetsScreen';

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
    path: "/",
    element: <SheetsScreen />,
    errorElement: <NotFoundScreen />,
    children: [
      {
        path: "song/:guid",
        element: <SheetScreen2 />,
        errorElement: <NotFoundScreen />,
      }
    ]
  }
]);

  return (
    <ThemeProvider theme={customTheme}>
      <RouterProvider router={router}/>

    </ThemeProvider>
  )
}

export default App;
