import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import { useDispatch } from 'react-redux'
import { setLoading, login } from './app/features/authSlice'
import api from './configs/api'
import { Toaster } from 'react-hot-toast'

const App = () => {

  const dispatch = useDispatch()
  const getUserData = async() => {
    const token = localStorage.getItem('token')
    try{
      if(token){
        const { data } = await api.get('/api/users/data', {headers: {Authorization: token}})
     if (data?.user) {
          dispatch(login({ token, user: data.user }));
        }
      } else {
        console.log('no token found');
      }
    } catch (error) {
      console.error('getUserData error:', error);
    } finally {
      // ALWAYS turn loading off no matter what happened
      dispatch(setLoading(false));
      console.log('setLoading(false) dispatched');
    }
  };

  useEffect(()=>{
    getUserData()
  },[])
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />}/>
          <Route path='builder/:resumeID' element={<ResumeBuilder />}/>
        </Route>
        <Route path='view/:resumeID' element={<Preview />}/>
        
      </Routes>
    </>
  )
}

export default App
