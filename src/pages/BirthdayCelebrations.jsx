import Layout from '../components/layout/Layout'
import { useState } from 'react'

export default function BirthdayCelebrations() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Birthday booking submitted:', formData)
    alert('Thank you! We will contact you soon to confirm your celebration.')
    setFormData({ name: '', email: '', phone: '', date: '', guests: '', message: '' })
  }

  return (
    <Layout>
      <section className="birthday-page">
        <h1>Birthday Celebrations</h1>
        <p>Make your special day unforgettable at DESIRE SHEESHA LOUNGE</p>

        <div className="celebration-features">
          <div className="feature">
            <h3>🎂 Customized Packages</h3>
            <p>Choose from our exclusive birthday packages tailored to your preferences</p>
          </div>
          <div className="feature">
            <h3>🎉 Premium Experience</h3>
            <p>Enjoy premium food, beverages, and shisha in an elegant setting</p>
          </div>
          <div className="feature">
            <h3>🎁 Special Gifts</h3>
            <p>Complimentary birthday gift and special surprises for the birthday person</p>
          </div>
          <div className="feature">
            <h3>🎵 Entertainment</h3>
            <p>Curated music and ambiance to make your celebration memorable</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <h2>Book Your Birthday Celebration</h2>
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date of Celebration</label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="guests">Number of Guests</label>
            <input
              id="guests"
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Special Requests</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about your preferences and special requirements"
            />
          </div>

          <button type="submit" className="btn btn-primary">Submit Booking Request</button>
        </form>
      </section>
    </Layout>
  )
}
