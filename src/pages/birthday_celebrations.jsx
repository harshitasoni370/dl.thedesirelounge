import { useEffect } from 'react'

export default function Birthdaycelebrations() {
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
          <section className="offer-sheet__panel" aria-labelledby="birthday-title">
            <header className="offer-sheet__banner">
              <span className="lounge-panel__rule" aria-hidden="true"></span>
              <h1 id="birthday-title">Birthday Celebrations</h1>
              <span className="lounge-panel__rule" aria-hidden="true"></span>
            </header>

            <p className="offer-sheet__tagline">Your Day. Your People. Your Celebration.</p>

            <p className="offer-sheet__copy offer-sheet__copy--lead">
              Make birthdays memorable at Desire Sheesha Lounge with personalized celebrations,
              entertainment and dining.
            </p>

            <ul className="offer-sheet__benefits">
              <li>
                Themed birthday decoration â balloons, table dÃ©cor and birthday backdrop/name board.
              </li>
              <li>
                Cake arrangement â bring your own cake or let us arrange one based on your
                preference.
              </li>
              <li>
                Birthday song &amp; special celebration entry â music, dimmed lights and staff
                presentation.
              </li>
              <li>
                Personalized big-screen message â birthday name, photo or video displayed on our
                LED/projector.
              </li>
              <li>
                Party poppers and special celebration effects, subject to venue safety and
                availability.
              </li>
              <li>
                Photo corner â photos/videos using the best available phone, with optional
                Instagram/TikTok Reel content.
              </li>
              <li>Customized food packages â starters, mains, beverages and dessert.</li>
              <li>Premium shisha add-on for eligible adult groups.</li>
              <li>PlayStation and board games available with selected packages.</li>
              <li>Complimentary birthday dessert or chocolates, subject to availability.</li>
              <li>Desire Sheesha Lounge-branded digital invitation for WhatsApp sharing.</li>
            </ul>

            <div className="offer-packages">
              <article className="offer-package">
                <h2>Basic â AED 99</h2>
                <p>
                  Table balloon decoration â¢ Birthday music â¢ Cake presentation â¢ Big-screen
                  birthday message â¢ Photos by our team.
                </p>
              </article>

              <article className="offer-package">
                <h2>Premium â AED 149</h2>
                <p>
                  Premium decoration â¢ Personalized big-screen message â¢ Cake arrangement â¢
                  Birthday dessert â¢ Premium reserved seating.
                </p>
              </article>

              <article className="offer-package offer-package--featured">
                <h2>VIP Celebration â AED 249+</h2>
                <p>
                  Private decoration â¢ Personalized LED screen with photo/video â¢ Cake â¢
                  Premium/private seating â¢ Dedicated service â¢ Special presentation. Food and
                  shisha can be customized separately.
                </p>
              </article>
            </div>

            <a
              className="offer-sheet__cta"
              href="https://wa.me/971509002202?text=Hi%2C%20I%27d%20like%20to%20book%20a%20Birthday%20Celebration"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Birthday Package
            </a>

            <p className="offer-sheet__brand">Desire Sheesha Lounge â¢ Customer Offers &amp; Packages</p>
          </section>
        </article>
        </main>
      </div>
    </>
  )
}
