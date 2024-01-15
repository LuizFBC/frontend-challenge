import './app.css'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Game from './game'
import HomePage from './games/wall-street/HomePage/index';

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/:token" element={<Game />}></Route>
          {/* <Route path="/homepage" exact component={HomePage} /> */}
        </Routes>
      </BrowserRouter>
    )
  }
}
