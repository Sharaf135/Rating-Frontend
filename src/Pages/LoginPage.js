import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    error: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()

    // Check for admin login
    if (formData.username === 'admin' && formData.password === 'admin123') {
      // Redirect to admin home
      navigate('/admin') // Use the route path for the admin home page
    }
    // Check for user login
    else if (formData.username === 'user1' && formData.password === 'user123') {
      // Redirect to user home
      navigate('/user') // Use the route path for the user home page
    } else {
      // Display an error message for invalid login
      setFormData({
        ...formData,
        error: 'Invalid username or password',
      })
    }
  }

  return (
    <div className='App' style={{ margin: '15rem' }}>
      <Card style={{ height: '20rem' }}>
        <div
          style={{ fontSize: '20px', padding: '20px', letterSpacing: '10px' }}
        >
          Login Page
        </div>

        <div className='container'>
          <div className='row d-flex justify-content-center'>
            <div className='col-md-4'>
              <form id='loginform' onSubmit={handleSubmit}>
                <div className='form-group'>
                  <label>Username</label>
                  <input
                    type='text'
                    className='form-control'
                    id='UsernameInput'
                    name='username'
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder='Enter username'
                  />
                </div>
                <div className='form-group'>
                  <label>Password</label>
                  <input
                    type='password'
                    className='form-control'
                    id='PasswordInput'
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder='Password'
                  />
                  {formData.error && (
                    <small className='text-danger'>{formData.error}</small>
                  )}
                </div>
                <div className='form-group form-check'>
                  <input
                    type='checkbox'
                    className='form-check-input'
                    id='exampleCheck1'
                  />
                  <label className='form-check-label'>Remember me</label>
                </div>
                <button type='submit' className='btn btn-primary'>
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default LoginPage
