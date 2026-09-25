import { useEffect } from 'react'

export default function Corporatebookings() {
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
          <section className="offer-sheet__panel" aria-labelledby="corporate-title">
            <header className="offer-sheet__banner">
              <span className="lounge-panel__rule" aria-hidden="true"></span>
              <h1 id="corporate-title">Corporate Bookings</h1>
              <span className="lounge-panel__rule" aria-hidden="true"></span>
            </header>

            <p className="offer-sheet__tagline">Meet â¢ Dine â¢ Celebrate â¢ Connect</p>

            <p className="offer-sheet__copy offer-sheet__copy--lead">
              From business lunches to team celebrations, we create flexible corporate experiences
              for groups.
            </p>

            <ul className="offer-sheet__benefits">
              <li>Team lunches &amp; dinners</li>
              <li>Annual awards ceremonies</li>
              <li>Office parties</li>
              <li>Team celebrations &amp; achievement parties</li>
              <li>Employee birthday celebrations</li>
              <li>Team-building events</li>
              <li>Corporate set menus / buffets</li>
              <li>Business meetings with coffee &amp; snacks</li>
              <li>Presentation / big-screen facility</li>
              <li>PlayStation &amp; board games for team activities</li>
              <li>Live music / entertainment add-on</li>
              <li>Customized company decoration / branding</li>
              <li>Group photos &amp; branded welcome screen</li>
              <li>Shisha packages for eligible adult groups</li>
              <li>Corporate billing / VAT invoice</li>
            </ul>

            <div className="offer-packages">
              <article className="offer-package">
                <h2>Business Lunch â From AED 49/person</h2>
                <p>
                  Selected starters â¢ Main course â¢ Beverage â¢ Dessert â¢ Reserved group seating.
                </p>
              </article>

              <article className="offer-package">
                <h2>Team Dinner â From AED 79/person</h2>
                <p>Starters â¢ Mains â¢ Breads/Rice â¢ Beverages â¢ Dessert.</p>
              </article>

              <article className="offer-package offer-package--featured">
                <h2>Corporate Celebration â From AED 99/person</h2>
                <p>
                  Food package â¢ Reserved event area â¢ Decoration â¢ Personalized company message
                  on the big screen â¢ Games &amp; entertainment.
                </p>
              </article>
            </div>

            <a
              className="offer-sheet__cta"
              href="https://wa.me/971509002202?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20Corporate%20Bookings"
              target="_blank"
              rel="noopener noreferrer"
            >
              Enquire Now
            </a>

            <p className="offer-sheet__terms">
              <strong>Booking Terms:</strong> Please inform management at least 2 days in advance.
              Reservation is confirmed with 50% advance payment.
            </p>

            <p className="offer-sheet__brand">Desire Sheesha Lounge â¢ Customer Offers &amp; Packages</p>
          </section>
        </article>
        </main>
      </div>
    </>
  )
}
