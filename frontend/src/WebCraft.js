import React from 'react';
import { Container, Row, Col, Card, Button, Accordion } from 'react-bootstrap';
import './WebCraft.css'; // Import custom styles
import logo from './assets/WebCraft.png'; 
import nike from './assets/nike.jpg';
import spik from './assets/spik.jpg';
import zara from './assets/zara.jpg';
import cff from './assets/cff.jpg';
import boba from './assets/boba.jpg';
import icecream from './assets/icecream.jpg';
import sprite from './assets/sprite.jpg';

import delivery from './assets/wdelivery.jpg';
import manage from './assets/wmanage.png';
import notification from './assets/wordernotifi.jpg';

// Sample data for businesses
const businessData = [
    {
      id: 1,
      image: nike,
    },
    {
      id: 2,
      image: spik,
    },
    {
      id: 3,
      image: sprite,
    },
    {
      id: 4,
      image: boba,
    },
    {
      id: 5,
      image: zara,
    },
    {
      id: 6,
      image: cff,
    },
    {
      id: 7,
      image: icecream,
    },
  ];  

const WebCraft = () => {
  return (
    <div className="webcraft-page">
      {/* Header */}
      <header className="header d-flex justify-content-between align-items-center p-3">
        <div className="logo">
          <img src={logo} alt="WebCraft Logo" width="150" />{" "}
          {/* Use the imported logo */}
        </div>
        <nav className="nav-links">
          <a href="/pricing" className="nav-link">
            Pricing
          </a>
          <a href="/login" className="nav-link">
            Login
          </a>
          <a href="/register" className="nav-link">
            Register
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section text-center py-5">
        <Container>
          <h1 className="main-message mb-3">
            Launch your online business within few minutes.
            <br />
            Build a website, manage your business and deliver all over Nepal
            with WebCraft.
          </h1>
          <Button variant="primary" size="lg" className="cta-button mb-3">
            Start your Free Trial
          </Button>
          <p className="sub-message">Try 3 months for free</p>
          <div className="highlights">
            <p>Receive online payment directly</p>
            <p>Zero tech skills needed</p>
            <p>Sell, Manage and Deliver like a PRO</p>
          </div>
        </Container>
      </section>

      <section className="business-showcase py-5">
        <Container fluid>
          {" "}
          {/* Use fluid container to span the full width */}
          <h2 className="text-center mb-4">
            WebCraft works for every Business.
            <br />
            From sports teams selling jerseys to influencers launching their
            brands — whatever you sell, WebCraft helps you sell it better!
          </h2>
          <div className="business-slider">
            <div className="slider-container">
              {/* Original business cards */}
              {businessData.map((business) => (
                <div key={business.id} className="business-card">
                  <img
                    src={business.image}
                    alt={`Business ${business.id}`}
                    className="business-image"
                  />
                </div>
              ))}
              {/* Duplicate the first 4 images for seamless looping */}
              {businessData.slice(0, 4).map((business) => (
                <div key={`duplicate-${business.id}`} className="business-card">
                  <img
                    src={business.image}
                    alt={`Business ${business.id}`}
                    className="business-image"
                  />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works py-5">
        <Container>
          <h2 className="text-center mb-4">How It Works</h2>

          {/* First Row: Receive Paid Orders */}
          <Row className="align-items-center mb-5">
            <div className="content-box bg-darkish text-white p-5 rounded d-flex flex-row align-items-center justify-content-between w-100">
              {/* Text Section */}
              <div className="text-section me-4">
                <h3>1. Receive Paid orders directly to your dashboard.</h3>
                <p>
                  Customers don't have to wait for replies anymore. They can
                  easily place orders directly through your website, simplifying
                  the process for both parties. All paid orders are
                  automatically updated on your WebCraft dashboard for
                  hassle-free management.
                </p>
              </div>
              {/* Image Section */}
              <img
                src={notification}
                alt="Receive Paid Orders"
                className="img-fluid"
                style={{ maxWidth: "300px" }}
              />
            </div>
          </Row>

          {/* Second Row: Manage Everything in One Place & Deliver All Over Nepal */}
          <Row className="mb-4">
            {/* Manage Everything in One Place */}
            <Col md={6}>
              <div className="content-box bg-darkish text-white p-5 rounded d-flex flex-column align-items-center">
                <img
                  src={manage}
                  alt="Manage Everything in One Place"
                  className="img-fluid mb-3"
                  style={{ maxWidth: "190px" }}
                />
                <h3>2. Manage everything in one place</h3>
                <p>
                  Manage orders, track inventory, and analyze sales data with
                  ease.
                </p>
              </div>
            </Col>

            {/* Deliver All Over Nepal */}
            <Col md={6}>
              <div className="content-box bg-darkish text-white p-5 rounded d-flex flex-column align-items-center">
                <img
                  src={delivery}
                  alt="Deliver All Over Nepal"
                  className="img-fluid mb-3"
                  style={{ maxWidth: "150px" }}
                />
                <h3>3. Deliver all over Nepal</h3>
                <p>
                  Seamlessly integrate with leading logistics companies in Nepal
                  and effortlessly deliver nationwide.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Overview Section */}
      <section className="features-overview py-5">
        <Container>
          <h2 className="text-center mb-4">
            WebCraft gives you everything you need to succeed online
          </h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Custom Domain</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Payment Gateway</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Website Customization</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Staff Management</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Coupon Codes</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Order Management</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Inventory Management</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Advanced Analytics</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Logistics Integration</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Issue Management</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Google Analytics</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQs Section */}
      <section className="faqs py-5">
        <Container>
          <h2 className="text-center mb-4">FAQs</h2>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                What is WebCraft and how does it work?
              </Accordion.Header>
              <Accordion.Body>
                WebCraft is an easy-to-use platform to run, manage, and grow
                your business online. You can create an online store, add
                products, manage inventory, accept online payments, and more —
                all from one place.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                How does WebCraft ensure the security and privacy of user data?
              </Accordion.Header>
              <Accordion.Body>
                We follow best security practices and host servers in secure
                data centers with multiple layers of physical and digital
                security. We use strict access controls, encryption, monitoring,
                and comply with all legal regulations.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                Does WebCraft charge a commission for selling products?
              </Accordion.Header>
              <Accordion.Body>
                No, WebCraft does not charge any commission on your sales.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                Do I need to register my business to use WebCraft?
              </Accordion.Header>
              <Accordion.Body>
                You can create a website without registering a business, but a
                registered business is required to use online payment gateways.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>
                Can I use my own domain with WebCraft?
              </Accordion.Header>
              <Accordion.Body>
                Yes. You can connect your existing domain or purchase a premium
                one through us for easy integration.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="5">
              <Accordion.Header>Can I upgrade my plan later?</Accordion.Header>
              <Accordion.Body>
                Yes, you can upgrade anytime via your Account Details section or
                by contacting support at support@WebCraft.com.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="6">
              <Accordion.Header>Can I accept online payments?</Accordion.Header>
              <Accordion.Body>
                Yes, we support eSewa, FonePay, Khalti, CyberSource
                (Visa/MasterCard), and WebCraft Payment Fulfillment.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="7">
              <Accordion.Header>
                What is WebCraft Payment Fulfillment?
              </Accordion.Header>
              <Accordion.Body>
                It’s our in-house payment gateway. Customers can pay via
                multiple options. We settle your payments every Friday.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="8">
              <Accordion.Header>
                What is the payment service fee?
              </Accordion.Header>
              <Accordion.Body>
                A 2.75–5% service fee is applied depending on your premium plan.
                The rest is deposited into your bank account.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="9">
              <Accordion.Header>
                Can I use my own merchant key for eSewa or FonePay?
              </Accordion.Header>
              <Accordion.Body>
                Yes. Simply add your own merchant key in the setup and receive
                payments directly into your company account.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="10">
              <Accordion.Header>
                Can I give staff access to my store?
              </Accordion.Header>
              <Accordion.Body>
                Yes, you can invite staff and assign them roles to help manage
                your store.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="11">
              <Accordion.Header>
                What happens after my subscription expires?
              </Accordion.Header>
              <Accordion.Body>
                Your store becomes inaccessible, but your data and settings are
                saved for when you resume a premium plan.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="12">
              <Accordion.Header>
                How do I cancel my WebCraft account?
              </Accordion.Header>
              <Accordion.Body>
                Contact us at support@WebCraft.com, and we’ll help you close
                your account and address any concerns.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="13">
              <Accordion.Header>Can I get a refund?</Accordion.Header>
              <Accordion.Body>
                Refunds are handled case-by-case. Reach out to
                support@WebCraft.com, and we’ll assist you based on your
                situation.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer text-center py-3">
        <Container>
          <img src="/path/to/logo.png" alt="WebCraft Logo" width="150" />
          <p className="mt-2">© 2025, ALL RIGHTS RESERVED. WEBCRAFT</p>
        </Container>
      </footer>
    </div>
  );
};

export default WebCraft;