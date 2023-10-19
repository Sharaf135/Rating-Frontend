import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function UpdateReviewComponent() {
  const { productId, reviewId } = useParams()
  const navigate = useNavigate()
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
  })

  useEffect(() => {
    // Fetch the review data by ID when the component mounts
    axios
      .get(`http://localhost:4000/api/reviews/${productId}/reviews/${reviewId}`)
      .then((res) => {
        const { rating, comment } = res.data
        setReviewData({ rating, comment })
      })
      .catch((err) => console.log(err))
  }, [productId, reviewId])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setReviewData({
      ...reviewData,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    // Send a PUT request to update the review
    axios
      .put(
        `http://localhost:4000/api/reviews/${productId}/reviews/${reviewId}`,
        reviewData
      )
      .then((res) => {
        console.log('Review updated:', res.data)
        // Redirect to the product page or review list page after updating
        navigate(`/user`)
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='rating'>
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type='number'
                name='rating'
                value={reviewData.rating}
                onChange={handleInputChange}
                min='1'
                max='5'
              />
            </Form.Group>

            <Form.Group controlId='comment'>
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as='textarea'
                name='comment'
                value={reviewData.comment}
                onChange={handleInputChange}
                rows='3'
              />
            </Form.Group>

            <div className='text-center' style={{marginTop: "20px"}}>
              <Button variant='primary' type='submit'>
                Update Review
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default UpdateReviewComponent
