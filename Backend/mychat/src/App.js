
import './App.css';
import { Button, ButtonGroup } from '@chakra-ui/react'
import { useContext } from 'react';
import Context, { logincontext } from './Context/Context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import Login from './Login';
import Message from './Home/Message';
function App() {
  return (
    <>
    <Context>
    <BrowserRouter>
    <Routes>
    <Route exact path="/" element={<Login/>}></Route>
    <Route exact path="/home" element={<Home/>}></Route>
    <Route exact path="/message" element={<Message/>}></Route>    
    </Routes>
    </BrowserRouter>
    </Context>
    </>
  );
}

export default App;
