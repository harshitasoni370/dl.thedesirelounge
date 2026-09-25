import { useEffect } from 'react'

export default function Privilegemembership() {
  useEffect(() => {
    // Initialize page-specific functionality if needed
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <div className="lounge-bg" aria-hidden="true">
        <div
          className="lounge-bg__image"
          style={{ backgroundImage: "url('assets/images/index-hero-bg.webp')" }}
        />
        <div className="lounge-bg__overlay" />
      </div>

      <div className="lounge-shell" id="app">
        {/* Header component would go here */}
        <main id="main" className="lounge-main">
          <article className="offer-sheet">
          <section className="offer-sheet__panel" aria-labelledby="privilege-title">
            <header className="offer-sheet__banner">
              <span className="lounge-panel__rule" aria-hidden="true"></span>
              <h1 id="privilege-title">Desire Privilege Membership</h1>
              <span className="lounge-panel__rule" aria-hidden="true"></span>
            </header>

            <p className="offer-sheet__tagline">
              365 Days. One Membership. More Reasons to Come Back.
            </p>

            <div className="offer-sheet__hero-deal">
              <p className="offer-sheet__price">AED 199 / YEAR</p>
              <p className="offer-sheet__headline">20% Off Every Visit</p>
            </div>

            <ul className="offer-sheet__benefits">
              <li>20% off food &amp; beverages on every dine-in bill</li>
              <li>20% off shisha</li>
              <li>Birthday-month special benefit</li>
              <li>Priority reservations</li>
              <li>Access to members-only offers</li>
              <li>Special rates on celebration packages</li>
              <li>Early access / priority booking for live events</li>
            </ul>

            <a
              className="offer-sheet__cta"
              href="https://wa.me/971509002202?text=Hi%2C%20I%27d%20like%20to%20join%20F%26F%20Privilege%20Membership"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Membership
            </a>

            <p className="offer-sheet__terms">
              Recommended membership terms: not combinable with other promotions, set menus or
              special-event packages; valid for dine-in only unless management decides otherwise.
              Final exclusions and redemption rules should be approved before launch.
            </p>

            <p className="offer-sheet__brand">Desire Sheesha Lounge â¢ Customer Offers &amp; Packages</p>
          </section>
        </article>
        </main>
      </div>
    </>
  )
}
