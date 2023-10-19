import React, { useEffect, useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import axios from 'axios'
import productImage from '../images/productImage.jpg' // Import the image
import ReactStars from 'react-rating-star-with-type'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'

function UserHome() {
  const [products, setProducts] = useState([])
  const [newReviews, setNewReviews] = useState({}) // State to manage new reviews for each product
  const [validationErrors, setValidationErrors] = useState({}) // State to manage validation errors

  useEffect(() => {
    // Fetch products from the API when the component mounts
    axios
      .get('http://localhost:4000/api/products') // Update the API endpoint as needed
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
      })
  }, [])

  // Function to handle submitting a new review
  const handleSubmitReview = (productId) => {
    // Get the new review data for the specific product
    const newReview = newReviews[productId]
    if (!newReview) {
      return // Don't submit if no review data is available
    }

    // Validate the rating and comment before submission
    const errors = {}
    if (newReview.rating < 1 || newReview.rating > 5) {
      errors[productId] = {
        ...errors[productId],
        rating: 'Rating must be between 1 and 5',
      }
    }
    if (!newReview.comment.trim()) {
      errors[productId] = {
        ...errors[productId],
        comment: 'Comment cannot be empty',
      }
    }

    // If there are validation errors, update the state and stop submission
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    // Send a POST request to your API to add the review to the database
    axios
      .post(`http://localhost:4000/api/reviews/${productId}/reviews`, newReview)
      .then((response) => {
        // Handle success (e.g., refresh the product list to display the new review)
        // You can also reset the new review form fields here if needed
        console.log('Review added:', response.data)

        // Reset the new review and validation errors for this product
        setNewReviews({
          ...newReviews,
          [productId]: { rating: 0, comment: '' },
        })
        setValidationErrors({})

        // Refresh the product list to display the new review (optional)
        axios
          .get('http://localhost:4000/api/products')
          .then((response) => {
            setProducts(response.data)
          })
          .catch((error) => {
            console.error('Error fetching products:', error)
          })
      })
      .catch((error) => {
        console.error('Error adding review:', error)
      })
  }

  // Function to update the new review data in the state
  const handleReviewChange = (productId, rating, comment) => {
    console.log(
      `Product ID: ${productId}, Rating: ${rating}, Comment: ${comment}`
    )
    setNewReviews({
      ...newReviews,
      [productId]: { rating, comment },
    })
  }

  // Function to delete a review
  const deleteReview = (productId, reviewId, comment) => {
    if (window.confirm(`Are you sure you want to delete "${comment}"?`)) {
      // Send a DELETE request to the API endpoint
      axios
        .delete(
          `http://localhost:4000/api/reviews/${productId}/reviews/${reviewId}`
        )
        .then((response) => {
          if (response.status === 200) {
            // Review deleted successfully
            console.log('Review deleted successfully')
            alert('Data Deleted')
            // You can perform additional actions here if needed

            // Refresh the product list to remove the deleted review
            axios
              .get('http://localhost:4000/api/products')
              .then((response) => {
                setProducts(response.data)
              })
              .catch((error) => {
                console.error('Error fetching products:', error)
              })
          } else {
            // Error deleting the review
            console.error('Error deleting the review')
          }
        })
        .catch((error) => {
          console.error('Error deleting the review:', error)
        })
    } else {
      alert('Canceled')
    }
  }

  return (
    <div className='container'>
      <div className='row'>
        {products.map((product) => (
          <div key={product._id} className='col-md-3 mb-4'>
            <Card style={{ width: '18rem', margin: '20px' }}>
              {/* Use the imported image as the source */}
              <Card.Img
                variant='top'
                src={productImage}
                alt={product.name} // Provide alt text for accessibility
              />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text> {product.description}</Card.Text>
              </Card.Body>
              <ListGroup className='list-group-flush'>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
              </ListGroup>
              <ListGroup className='list-group-flush'>
                <h5>Reviews:</h5>
                {product.reviews.map((review, index) => (
                  <div key={index}>
                    <Card.Body>
                      <ReactStars
                        style={{ margin: '20px', paddingLeft: '60px' }}
                        value={review.rating}
                        edit={false}
                        activeColors={[
                          'red',
                          'orange',
                          '#FFCE00',
                          '#9177FF',
                          '#8568FC',
                        ]}
                      />
                      <Card.Text> Comment: {review.comment}</Card.Text>
                      <Link to={`/update/${product._id}/${review._id}`}>
                        <Button variant='outline-info'>Edit</Button>
                      </Link>
                      <Button
                        variant='outline-danger'
                        onClick={() =>
                          deleteReview(product._id, review._id, review.comment)
                        }
                        style={{ marginLeft: '10px' }} // Add margin to create space
                      >
                        Delete
                      </Button>
                    </Card.Body>
                  </div>
                ))}
              </ListGroup>
              {/* Add Review Form */}
              <div className='review-form'>
                <h5>Add a Review:</h5>
                <div className='mb-2'>
                  <input
                    type='number'
                    min='1'
                    max='5'
                    className={`form-control ${
                      validationErrors[product._id]?.rating ? 'is-invalid' : ''
                    }`}
                    placeholder='Enter rating (1-5)'
                    value={newReviews[product._id]?.rating || 0}
                    onChange={(e) =>
                      handleReviewChange(
                        product._id,
                        parseInt(e.target.value) || 0,
                        newReviews[product._id]?.comment || ''
                      )
                    }
                  />
                  {validationErrors[product._id]?.rating && (
                    <div className='invalid-feedback'>
                      {validationErrors[product._id]?.rating}
                    </div>
                  )}
                </div>
                <div className='mb-2'>
                  <textarea
                    className={`form-control ${
                      validationErrors[product._id]?.comment ? 'is-invalid' : ''
                    }`}
                    placeholder='Enter your review here...'
                    value={newReviews[product._id]?.comment || ''}
                    onChange={(e) =>
                      handleReviewChange(
                        product._id,
                        newReviews[product._id]?.rating || 0,
                        e.target.value
                      )
                    }
                  ></textarea>
                  {validationErrors[product._id]?.comment && (
                    <div className='invalid-feedback'>
                      {validationErrors[product._id]?.comment}
                    </div>
                  )}
                </div>
                <Card.Body>
                  <button
                    className='btn btn-primary'
                    onClick={() => handleSubmitReview(product._id)}
                  >
                    Add New Review
                  </button>
                </Card.Body>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserHome
