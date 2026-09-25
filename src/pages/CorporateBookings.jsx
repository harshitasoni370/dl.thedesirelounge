import Layout from '../components/layout/Layout'
import { useState } from 'react'

export default function CorporateBookings() {
  const [formData, setFormData] = useState({
    companyName: '',
    contact: '',
    email: '',
    phone: '',
    eventDate: '',
    attendees: '',
    eventType: 'team-building',
    budget: '',
    requirements: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Corporate booking submitted:', formData)
    alert('Thank you! Our corporate team will contact you shortly.')
    setFormData({
      companyName: '',
      contact: '',
      email: '',
      phone: '',
      eventDate: '',
      attendees: '',
      eventType: 'team-building',
      budget: '',
      requirements: ''
    })
  }

  return (
    <Layout>
      <section className="corporate-page">
        <h1>Corporate Bookings</h1>
        <p>Plan your perfect corporate event at DESIRE SHEESHA LOUNGE</p>

        <div className="corporate-services">
          <div className="service-card">
            <h3>Team Building Events</h3>
            <p>Create memorable team bonding experiences with our curated activities and premium offerings</p>
          </div>
          <div className="service-card">
            <h3>Client Entertainment</h3>
            <p>Impress your clients with an upscale venue and exceptional hospitality</p>
          </div>
          <div className="service-card">
            <h3>Conference & Meetings</h3>
            <p>Professional spaces for your business meetings with complete amenities</p>
          </div>
          <div className="service-card">
            <h3>Corporate Parties</h3>
            <p>Celebrate milestones with your team in an elegant and vibrant atmosphere</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <h2>Book Your Corporate Event</h2>

          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              id="companyName"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Person Name</label>
            <input
              id="contact"
              type="text"
              name="contact"
              value={formData.contact}
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
            <label htmlFor="eventDate">Event Date</label>
            <input
              id="eventDate"
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="attendees">Number of Attendees</label>
            <input
              id="attendees"
              type="number"
              name="attendees"
              value={formData.attendees}
              onChange={handleChange}
              min="10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="eventType">Event Type</label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
            >
              <option value="team-building">Team Building</option>
              <option value="client-entertainment">Client Entertainment</option>
              <option value="conference">Conference/Meeting</option>
              <option value="celebration">Celebration/Party</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget">Approximate Budget (per person)</label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
            >
              <option value="">Select a range</option>
              <option value="1000-2000">₹1,000 - ₹2,000</option>
              <option value="2000-5000">₹2,000 - ₹5,000</option>
              <option value="5000-10000">₹5,000 - ₹10,000</option>
              <option value="10000+">₹10,000+</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Special Requirements</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about your specific requirements and preferences"
            />
          </div>

          <button type="submit" className="btn btn-primary">Submit Inquiry</button>
        </form>

        <section className="contact-info">
          <h2>Need Help?</h2>
          <p>Contact our corporate team for personalized assistance</p>
          <a href="tel:+919876543210" className="btn btn-secondary">Call Us</a>
        </section>
      </section>
    </Layout>
  )
}
