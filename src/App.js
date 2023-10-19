import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './Pages/LoginPage'
import {React}  from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import AdminHome from './Pages/AdminHome'
import UserHome from './Pages/UserHome.js'
import NavBar from './components/navBar'
import UpdateReview from './components/UpdateReviewComponent'
// import { toFormData } from 'axios';


function App() {

  return (
 
    <div className='App'>
      <NavBar>
      </NavBar>
      <Router>
        <Routes>
          <Route exact path='/' element={<LoginPage />} />
          <Route exact path='/admin' element={<AdminHome />} />
          <Route exact path='/user' element={<UserHome />} />
          <Route
            exact
            path='/update/:productId/:reviewId'
            element={<UpdateReview />}
          />
        </Routes>
      </Router>
  
    </div>
  
  )
}

export default App
