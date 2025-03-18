import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashBoard from './components/DashBoard';
import Loading from './components/Loading';
import TokenProvider from './components/AuthToken';
import NewRegister from './components/NewRegister';
import AccessList from './components/AccessList';
import WritePost from './components/WritePost';
import AllBlogs from './components/AllBlogs';
import { useNavigate } from "react-router-dom";
import api, { setNavigate }  from './utils/ApiHandel.js';
import { UserProvider } from './GlobalData/ProfileData.jsx';

function App() {
  const navigate = useNavigate();
  //by using this i can use navigateinto .js file as well
  setNavigate(navigate);

 return(

  <TokenProvider>
   
  <ToastContainer  style={{ fontSize: "1.6rem", width: "300px" }} position="bottom-left"
  autoClose={3000}
  closeOnClick
  pauseOnHover
  draggable
  theme="dark" />

 <Routes>
  <Route path="/" element={<DashBoard />}>{/* 👈 Nested Route */}
    <Route path="/NewRegister" element={<NewRegister />} />
    <Route path="/AccessList" element={<AccessList />} />
    <Route path="/WritePost" element={<WritePost />} /> 
    <Route path="/AllBlogs" element={<AllBlogs/>} />
  </Route>
   <Route path='/Login' element={<Login/>} />
   <Route path='/Loading' element={<Loading/>} />
  


  </Routes>


  </TokenProvider>

 )



}

export default App
