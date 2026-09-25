import Layout from '../components/layout/Layout'
import { useState } from 'react'

export default function MakeItYourMoment() {
  const [selectedService, setSelectedService] = useState('romantic-dinner')

  const services = [
    {
      id: 'romantic-dinner',
      title: 'Romantic Dinner',
      description: 'Create unforgettable memories with your special someone',
      features: [
        'Private or semi-private seating',
        'Specially curated menu',
        'Premium shisha experience',
        'Personalized ambiance setup',
        'Complimentary welcome drink'
      ]
    },
    {
      id: 'friend-gathering',
      title: 'Friends Gathering',
      description: 'Perfect place to hangout with your squad',
      features: [
        'Group-friendly seating',
        'Variety of games and entertainment',
        'Special group discounts',
        'Extended gaming hours',
        'Party atmosphere with music'
      ]
    },
    {
      id: 'family-outing',
      title: 'Family Outing',
      description: 'Spend quality time with your loved ones',
      features: [
        'Family-friendly environment',
        'Kids entertainment options',
        'Diverse menu for all tastes',
        'Safe and comfortable setting',
        'Group reservation options'
      ]
    },
    {
      id: 'business-meeting',
      title: 'Business Meeting',
      description: 'Impress clients in an upscale setting',
      features: [
        'Professional ambiance',
        'Private meeting spaces',
        'Business-hours flexibility',
        'Premium service',
        'Refreshment options'
      ]
    }
  ]

  const selectedService_ = services.find(s => s.id === selectedService)

  return (
    <Layout>
      <section className="moment-page">
        <h1>Make It Your Moment</h1>
        <p>Create your perfect experience at DESIRE SHEESHA LOUNGE</p>

        <div className="service-selector">
          {services.map(service => (
            <button
              key={service.id}
              className={`service-btn ${selectedService === service.id ? 'active' : ''}`}
              onClick={() => setSelectedService(service.id)}
            >
              {service.title}
            </button>
          ))}
        </div>

        {selectedService_ && (
          <div className="service-details">
            <h2>{selectedService_.title}</h2>
            <p className="service-description">{selectedService_.description}</p>

            <div className="features-list">
              <h3>What's Included</h3>
              <ul>
                {selectedService_.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
            </div>

            <a href="/" className="btn btn-primary">Book Your Moment</a>
          </div>
        )}

        <section className="moment-gallery">
          <h2>Gallery</h2>
          <p>Get inspired by the moments our guests have created</p>
          <div className="gallery-placeholder">
            <p>Photo gallery coming soon...</p>
          </div>
        </section>

        <section className="testimonials">
          <h2>Guest Testimonials</h2>
          <div className="testimonial-cards">
            <div className="testimonial">
              <p>"Had an amazing birthday celebration here! The staff was incredibly helpful and the ambiance was perfect!"</p>
              <p className="author">- Priya & Friends</p>
            </div>
            <div className="testimonial">
              <p>"Best Sunday brunch experience! Love the food, shisha, and the overall vibe of the place."</p>
              <p className="author">- Akshay M.</p>
            </div>
            <div className="testimonial">
              <p>"Perfect spot for team building. Our entire team loved the games and the hospitality."</p>
              <p className="author">- Corporate Team, XYZ Corp</p>
            </div>
            <div className="testimonial">
              <p>"My romantic dinner was absolutely perfect! Everything was just as I wanted. Highly recommend!"</p>
              <p className="author">- Rahul & Sneha</p>
            </div>
          </div>
        </section>

        <section className="cta-final">
          <h2>Ready to Make Your Moment?</h2>
          <p>Contact us or visit our lounge to experience the magic of DESIRE</p>
          <div className="cta-buttons">
            <a href="/" className="btn btn-primary">Make a Reservation</a>
            <a href="/" className="btn btn-secondary">Contact Us</a>
          </div>
        </section>
      </section>
    </Layout>
  )
}
