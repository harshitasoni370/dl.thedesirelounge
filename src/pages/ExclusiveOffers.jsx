import Layout from '../components/layout/Layout'

export default function ExclusiveOffers() {
  const offers = [
    {
      id: 1,
      title: 'Happy Hour Special',
      description: '50% off on selected shisha flavors',
      validTill: 'Every weekday 5 PM - 8 PM'
    },
    {
      id: 2,
      title: 'Weekend Bonanza',
      description: 'Buy 2 premium items, get 1 complimentary appetizer',
      validTill: 'Saturday & Sunday'
    },
    {
      id: 3,
      title: 'Group Bookings',
      description: 'Special rates for groups of 6 or more',
      validTill: 'All week'
    },
    {
      id: 4,
      title: 'Menu Sampler',
      description: 'Try our best-selling dishes at a special price',
      validTill: 'Limited time offer'
    }
  ]

  return (
    <Layout>
      <section className="offers-page">
        <h1>Exclusive Offers</h1>
        <p>Enjoy special deals and exclusive benefits at DESIRE SHEESHA LOUNGE</p>

        <div className="offers-grid">
          {offers.map(offer => (
            <div key={offer.id} className="offer-card">
              <h3>{offer.title}</h3>
              <p className="offer-description">{offer.description}</p>
              <p className="valid-till">Valid: {offer.validTill}</p>
              <a href="/privilege-membership" className="btn btn-secondary">Learn More</a>
            </div>
          ))}
        </div>

        <section className="cta-section">
          <h2>Join Our Privilege Membership</h2>
          <p>Unlock exclusive offers and earn rewards on every visit</p>
          <a href="/privilege-membership" className="btn btn-primary">Become a Member</a>
        </section>
      </section>
    </Layout>
  )
}
