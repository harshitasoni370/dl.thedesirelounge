import { useEffect } from 'react'

export default function Exclusiveoffers() {
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
          <section className="offer-sheet__panel" aria-labelledby="offers-title">
            <header className="offer-sheet__banner">
              <span className="lounge-panel__rule" aria-hidden="true"></span>
              <h1 id="offers-title">Exclusive Offers</h1>
              <span className="lounge-panel__rule" aria-hidden="true"></span>
            </header>

            <p className="offer-sheet__tagline">More Reasons to Visit. More Reasons to Stay.</p>

            <div className="offer-packages">
              <article className="offer-package offer-package--featured">
                <h2>Ladies Exclusive â Complimentary Shisha</h2>
                <p className="offer-package__meta">For her Â· Selected standard flavours</p>
                <p>
                  Eligible ladies can enjoy one complimentary standard shisha, with charcoal
                  replacement included. Premium, special and signature flavours are excluded.
                </p>
                <p>
                  <a href="/ladies-exclusive">View terms &amp; claim offer â</a>
                </p>
              </article>

              <article className="offer-package offer-package--featured">
                <h2>Sunday Brunch â From AED 29/person</h2>
                <p className="offer-package__meta">Every Sunday | 12 PM â 5 PM</p>
                <p>
                  Classic Brunch AED 29 â¢ Classic + Shisha AED 59 â¢ Premium Sunday AED 129.
                  Includes board games, PlayStation and live sports where scheduled.
                </p>
                <p>
                  <a href="/sunday-brunch">View Sunday Brunch packages â</a>
                </p>
              </article>

              <article className="offer-package">
                <h2>Breakfast â AED 12</h2>
                <p className="offer-package__meta">Daily | 8:00 AM â 10:00 AM</p>
                <p>
                  Choose a selected breakfast combination: Samosa + Kadak Tea â¢ Bun Maska/Bread
                  Butter + Kadak Tea â¢ Paratha (Aloo/Gobi/Kerala) + Kadak Tea â¢ Bread Omelette +
                  Kadak Tea â¢ Egg Roll + Kadak Tea.
                </p>
              </article>

              <article className="offer-package">
                <h2>Shisha Happy Hours â AED 20</h2>
                <p>
                  Selected shisha flavours | 8:00 AM â 11:00 AM &amp; 4:00 PM â 6:00 PM.
                </p>
              </article>

              <article className="offer-package">
                <h2>Food + Shisha Combo â AED 59</h2>
                <p>
                  1 basic-flavour shisha + one selected item: Samosa Chaat / French Fries / Dahi
                  Puri / Momo / Pasta / Chilli Chicken / Chilli Paneer.
                </p>
              </article>

              <article className="offer-package">
                <h2>Shisha + Drink â AED 49</h2>
                <p>
                  1 basic-flavour shisha + selected Mojito / Fresh Milk Tea / Coffee / Lemon Drink.
                </p>
              </article>

              <article className="offer-package">
                <h2>Come Back Offer â 20% Off Your Next Visit</h2>
                <p>
                  For first-time customers returning for their next visit. Applicable terms and
                  conditions should be communicated at redemption.
                </p>
              </article>

              <article className="offer-package">
                <h2>Review &amp; Follow â A Little Thank-You From Us</h2>
                <p>
                  Share your honest Google feedback, follow us on Instagram and TikTok, or explore
                  our online ordering platforms. Complimentary chocolates may be offered subject to
                  availability.
                </p>
              </article>
            </div>

            <a
              className="offer-sheet__cta"
              href="https://wa.me/971509002202?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20Exclusive%20Offers"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ask About Offers
            </a>

            <p className="offer-sheet__brand">Desire Sheesha Lounge â¢ Customer Offers &amp; Packages</p>
          </section>
        </article>
        </main>
      </div>
    </>
  )
}
