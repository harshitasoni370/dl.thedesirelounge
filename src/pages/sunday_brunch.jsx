import { useEffect } from 'react'

export default function Sundaybrunch() {
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
          <section className="offer-sheet__panel" aria-labelledby="brunch-title">
            <header className="offer-sheet__banner">
              <span className="lounge-panel__rule" aria-hidden="true"></span>
              <h1 id="brunch-title">Sunday Brunch</h1>
              <span className="lounge-panel__rule" aria-hidden="true"></span>
            </header>

            <p className="offer-sheet__tagline">Sunday tastes better at Desire Sheesha Lounge.</p>

            <p className="offer-sheet__copy offer-sheet__copy--lead">
              Every Sunday | 12 PM â 5 PM
            </p>

            <div className="offer-packages">
              <article className="offer-package">
                <h2>Classic Brunch â AED 29/person</h2>
                <p>
                  Choose 1 starter + 1 main + 1 beverage + a small dessert. Includes complimentary
                  access to board games and PlayStation, with live sports where scheduled.
                </p>
              </article>

              <article className="offer-package">
                <h2>Classic Brunch + Shisha â AED 59</h2>
                <p>Classic Brunch package + 1 regular shisha for every 2 guests.</p>
              </article>

              <article className="offer-package offer-package--featured">
                <h2>Premium Sunday â AED 129</h2>
                <p>
                  Upgraded starters/mains + mocktail + dessert + 1 premium shisha for every 2 guests.
                </p>
              </article>
            </div>

            <a
              className="offer-sheet__cta"
              href="https://wa.me/971509002202?text=Hi%2C%20I%27d%20like%20to%20book%20Sunday%20Brunch"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Sunday Brunch
            </a>

            <p className="offer-sheet__terms">
              <strong>Note:</strong> The source draft also mentioned AED 69/person before listing
              Classic Brunch at AED 29. This version uses AED 29 as the package price; please confirm
              before publishing.
            </p>

            <p className="offer-sheet__brand">Desire Sheesha Lounge â¢ Customer Offers &amp; Packages</p>
          </section>
        </article>
        </main>
      </div>
    </>
  )
}
