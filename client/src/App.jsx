import React, { useReducer } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/home/Home'
import NewProject from './pages/NewProject'
import FundProject from './pages/FundProject'
import SeeProjects from './pages/SeeProjects'

import './app.scss'

import { contextReducer } from './helpers/reducers'
import Context from './helpers/Context'
import { getLocalStorageObject } from './helpers/helperFunctions'

function App() {
  const [contextValue, dispatchContextValue] = useReducer(contextReducer, {
    loggedIn: localStorage.getItem('loggedIn'),
    web3: getLocalStorageObject('web3'),
  })
  return (
    <Context.Provider value={{ contextValue, dispatchContextValue }}>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/newproject" element={<NewProject />} />
            <Route path="/fundproject" element={<FundProject />} />
            <Route path="/seeprojects" element={<SeeProjects />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Context.Provider>
  )
}

export default App
