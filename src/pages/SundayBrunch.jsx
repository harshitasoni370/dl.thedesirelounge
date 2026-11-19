import Layout from '../components/layout/Layout'
import { useState } from 'react'

export default function SundayBrunch() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '11:00',
    guests: '',
    preferences: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Reservation request submitted! We will confirm shortly.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '11:00',
      guests: '',
      preferences: ''
    })
  }

  return (
    <Layout>
      <section className="brunch-page">
        <h1>Sunday Brunch</h1>
        <p>Experience our premium Sunday brunch with exclusive offerings</p>

        <section className="brunch-features">
          <div className="highlight">
            <h3>🍽️ Curated Menu</h3>
            <p>Specially crafted brunch menu featuring international and local delicacies</p>
          </div>
          <div className="highlight">
            <h3>☕ Premium Beverages</h3>
            <p>Enjoy coffee, juices, and our signature beverages prepared by expert baristas</p>
          </div>
          <div className="highlight">
            <h3>🎵 Live Entertainment</h3>
            <p>Enjoy live music and entertainment while you dine</p>
          </div>
          <div className="highlight">
            <h3>🌟 Relaxed Ambiance</h3>
            <p>Perfect setting to start your weekend with friends and family</p>
          </div>
        </section>

        <section className="brunch-details">
          <h2>Brunch Details</h2>
          <div className="details-grid">
            <div className="detail-item">
              <h4>Timing</h4>
              <p>11:00 AM - 4:00 PM</p>
            </div>
            <div className="detail-item">
              <h4>Days</h4>
              <p>Every Sunday</p>
            </div>
            <div className="detail-item">
              <h4>Per Person</h4>
              <p>Starting ₹999</p>
            </div>
            <div className="detail-item">
              <h4>Reservation</h4>
              <p>Recommended</p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="booking-form">
          <h2>Reserve Your Spot</h2>

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
            <label htmlFor="date">Date</label>
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
            <label htmlFor="time">Preferred Time</label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            >
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
            </select>
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
            <label htmlFor="preferences">Dietary Preferences</label>
            <textarea
              id="preferences"
              name="preferences"
              value={formData.preferences}
              onChange={handleChange}
              rows="3"
              placeholder="Let us know about any allergies or dietary preferences"
            />
          </div>

          <button type="submit" className="btn btn-primary">Reserve Now</button>
        </form>
      </section>
    </Layout>
  )
}
