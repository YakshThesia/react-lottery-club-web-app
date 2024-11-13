import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginScreen from '../Screens/LoginScreen'
import Home from '../Screens/Home/Home'
import Recharge from '../Screens/FundsManagement/Recharge'
import RechargeHistory from '../Screens/FundsManagement/RechargeHistory'
import Withdraw from '../Screens/FundsManagement/Withdraw'
import WithdrawHistory from '../Screens/FundsManagement/WithdrawHistory'
import AddBank from '../Screens/FundsManagement/AddBank'

const RouteList = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<LoginScreen/>} />
      <Route path='/home' element={<Home/>} />
      <Route path='/recharge' element={<Recharge/>} />
      <Route path='/recharge-history' element={<RechargeHistory/>} />
      <Route path='/withdraw' element={<Withdraw/>} />
      <Route path='/withdraw-history' element={<WithdrawHistory/>} />
      <Route path='/add-bank' element={<AddBank/>} />
    </Routes>
    </>
  )
}

export default RouteList