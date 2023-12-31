import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

function ColorSchemesExample() {
  return (
    <>
      <Navbar bg='dark' data-bs-theme='dark'>
        <Container>
          <Navbar.Brand href='/'>B4 Store</Navbar.Brand>
          <Nav className='me-auto'>
            <Nav.Link href='/'>Home</Nav.Link>
            <Nav.Link href='/admin'>Admin</Nav.Link>
            <Nav.Link href='/user'>User</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default ColorSchemesExample
