import { Route, Routes, useNavigate } from 'react-router-dom';
import User from './components/userPage/user';
import Login from './components/loginPage/login';
import './App.css';
import { useEffect } from 'react';
import Info from './components/InfoPage/Info';

const App = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!sessionStorage.name)
  //     navigate('/')
  // }, [navigate])

  return <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/user/:id" element={<User />} />
    </Routes>
  </>
}

export default App;
