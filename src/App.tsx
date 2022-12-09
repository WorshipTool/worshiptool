import React from 'react';
import SearchScreen from './SearchScreen';
import './App.css';
import SheetScreen from './Screens/SheetScreen';
import HomeScreen from './Screens/Home/HomeScreen';
import { ThemeProvider } from '@emotion/react';
import { blue, blueGrey, purple } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import AddSongScreen from './Screens/AddSong/AddSongScreen';
import { createBrowserRouter, Route } from 'react-router-dom';
import { Router, RouterProvider } from 'react-router';
import NotFoundScreen from './Screens/NotFoundScreen';

// import ReactDOM from 'react-dom';  
// import { Route, Link, BrowserRouter as Router } from 'react-router-dom'  

function App() {

  const customTheme = createTheme({
    // palette: {
    //   primary: {
    //     main: blueGrey[600],
    //   },
    //   secondary: {
    //     main: '#11cb5f',
    //   },
    // },
  });

  const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen />,
    errorElement: <NotFoundScreen />,
  },
  {
    path: "song/:guid",
    element: <SheetScreen />,
    errorElement: <NotFoundScreen />,
  },
]);

  return (
    <ThemeProvider theme={customTheme}>
      <RouterProvider router={router}/>

    </ThemeProvider>
  )
}

export default App;
