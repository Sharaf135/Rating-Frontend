import React, { useEffect, useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import axios from 'axios'
import productImage from '../images/productImage.jpg' // Import the image
import ReactStars from 'react-rating-star-with-type'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Button from 'react-bootstrap/Button'

function UserHome() {
  const [products, setProducts] = useState([])
  const [searchTerm,setSearchTerm] = useState('')
  const [filteredProducts,setFilteredProducts] = useState([])
  const [reviewCounts,setReviewCounts] = useState([])
  useEffect(() => {
    // Fetch products from the API when the component mounts
    axios
      .get('http://localhost:4000/api/products') // Update the API endpoint as needed
      .then((response) => {
        setProducts(response.data)
        const counts = {}
        response.data.forEach((product) => {
          counts[product._id] = product.reviews.length
        })
        setReviewCounts(counts)
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
      })
  }, [])
  useEffect(() =>{
    if(searchTerm.trim()===''){
      setFilteredProducts(products)
    }else{
      const filtered = products.filter((product)=>
      product.reviews.some((review)=>
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      setFilteredProducts(filtered)
    }
  },[searchTerm,products])
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
                //for recalculate
                const counts = {}
                response.data.forEach((product) => {
                  counts[product._id] = product.reviews.length
                })
                setReviewCounts(counts)
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

  const generatePDFReport =() =>{
    const doc = new jsPDF()
    doc.setFontSize(12)
    doc.text('Product Report' ,10,10)

    const tableHeaders =[
      'Product Name',
      'Description',
      'Price',
      'Review Count',
    ]

    const tableData = []

    filteredProducts.forEach((product) =>{
      const rowData =[
        product.name,
        product.description,
        product.price,
        reviewCounts[product._id] || 0
      ]
      tableData.push(rowData)
    })
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 20,
      theme: 'striped', // You can change the theme as needed
      styles: { fontSize: 10 },
    })
    doc.save('Produc_ Analysis_Report.pdf')
  }

  return (
    <div className='container'>
      <div className = 'mb-4'>
        <input
        type = 'text'
        style={{margin: '20px'}}
        className='form-control'
        placeholder='Search by review Comment...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='row'>
        {filteredProducts.map((product) => (
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
                <h5>Reviews({reviewCounts[product._id] || 0})</h5>
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
            </Card>
          </div>
        ))}
      </div>
      <div>
        <Button
        variant='primary'
        onClick={generatePDFReport}
        style={{margin: '20px'}}
        >
          Download Report as PDF
        </Button>
      </div>
    </div>
  )
}

export default UserHome
