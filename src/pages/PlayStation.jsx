import { useEffect } from 'react'

export default function Playstation() {
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
          <section className="lounge-hero bg-hero" aria-labelledby="ps-hero-heading">
          <p className="lounge-hero__welcome">PlayStation</p>
          <h1 id="ps-hero-heading" className="lounge-hero__title">Game. Compete. Have Fun.</h1>
          <p className="lounge-hero__copy">
            Book a PS5 session, pick your game, and play with friends while you dine at Desire Sheesha Lounge.
          </p>
          <ul className="bg-hero__perks">
            <li>
              <span className="bg-hero__perk-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                  <rect x="2" y="7" width="20" height="11" rx="3" />
                  <circle cx="7.5" cy="12.5" r="1.4" />
                  <circle cx="16.5" cy="12.5" r="1.4" />
                </svg>
              </span>
              <span>PS5 Consoles</span>
            </li>
            <li>
              <span className="bg-hero__perk-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="3.2" />
                  <path d="M22 21v-2a3.5 3.5 0 0 0-2.5-3.35" />
                  <path d="M16.5 3.7a3.2 3.2 0 0 1 0 6.2" />
                </svg>
              </span>
              <span>Up to 4 Players</span>
            </li>
            <li>
              <span className="bg-hero__perk-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                  <path d="M12 22s8-4.5 8-11.2A4.8 4.8 0 0 0 12 6.2 4.8 4.8 0 0 0 4 10.8C4 17.5 12 22 12 22z" />
                  <path d="M9.5 11.2l1.7 1.7 3.4-3.5" />
                </svg>
              </span>
              <span>For Dine-in Guests</span>
            </li>
          </ul>
        </section>

        <section className="lounge-panel bg-panel" aria-labelledby="browse-heading">
          <div className="lounge-panel__head">
            <span className="lounge-panel__rule" aria-hidden="true"></span>
            <h2 id="browse-heading">Browse PS5 Games</h2>
            <span className="lounge-panel__rule" aria-hidden="true"></span>
          </div>

          <div className="bg-toolbar">
            <p id="ps-count" className="bg-toolbar__count">12 games</p>

            <label className="bg-search">
              <span className="sr-only">Search games</span>
              <input
                type="search"
                id="ps-search"
                placeholder="Search games..."
                autocomplete="off"
                enterkeyhint="search"
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </label>

            <button type="button" className="bg-request-btn" id="ps-request-any">
              Request Session
            </button>
          </div>

          <div className="bg-filters" id="ps-filters" role="group" aria-label="Filter by category">
            <button type="button" className="bg-filter is-active" data-filter="all" aria-pressed="true">All Games</button>
            <button type="button" className="bg-filter" data-filter="action" aria-pressed="false">Action</button>
            <button type="button" className="bg-filter" data-filter="sports" aria-pressed="false">Sports</button>
            <button type="button" className="bg-filter" data-filter="racing" aria-pressed="false">Racing</button>
            <button type="button" className="bg-filter" data-filter="fighting" aria-pressed="false">Fighting</button>
            <button type="button" className="bg-filter" data-filter="multiplayer" aria-pressed="false">Multiplayer</button>
            <button type="button" className="bg-filter" data-filter="adventure" aria-pressed="false">Adventure</button>
          </div>

          <div className="bg-grid" id="ps-grid" aria-live="polite"></div>

          <div className="bg-empty" id="ps-empty" hidden>
            <p>No games match your search. Try another category or keyword.</p>
            <button type="button" className="bg-filter is-active" id="ps-reset-filters">
              Show All Games
            </button>
          </div>
        </section>

        <section className="bg-info" aria-label="How it works and session rules">
          <div className="lounge-panel bg-info__card">
            <div className="lounge-panel__head">
              <span className="lounge-panel__rule" aria-hidden="true"></span>
              <h2>How It Works</h2>
              <span className="lounge-panel__rule" aria-hidden="true"></span>
            </div>
            <ol className="bg-steps">
              <li className="bg-step">
                <span className="bg-step__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <path d="M12 3.2l1.9 4.7 5.1.4-3.9 3.2 1.2 4.9L12 13.9 7.7 16.4l1.2-4.9L5 8.3l5.1-.4L12 3.2z" />
                  </svg>
                </span>
                <div>
                  <strong>1. Choose a Game</strong>
                  <p>Browse our PS5 library and pick what you want to play.</p>
                </div>
              </li>
              <li className="bg-step">
                <span className="bg-step__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M16 3v4M8 3v4M3 11h18" />
                  </svg>
                </span>
                <div>
                  <strong>2. Request a Session</strong>
                  <p>Tap âRequest Sessionâ and confirm your booking online.</p>
                </div>
              </li>
              <li className="bg-step">
                <span className="bg-step__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <rect x="2" y="7" width="20" height="11" rx="3" />
                    <circle cx="7.5" cy="12.5" r="1.4" />
                    <circle cx="16.5" cy="12.5" r="1.4" />
                  </svg>
                </span>
                <div>
                  <strong>3. We Set It Up</strong>
                  <p>Our team prepares the console and controllers for your table.</p>
                </div>
              </li>
              <li className="bg-step">
                <span className="bg-step__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </span>
                <div>
                  <strong>4. Play &amp; Enjoy</strong>
                  <p>Have fun! Return the controllers when your session ends.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="lounge-panel bg-info__card">
            <div className="lounge-panel__head">
              <span className="lounge-panel__rule" aria-hidden="true"></span>
              <h2>Session Rules</h2>
              <span className="lounge-panel__rule" aria-hidden="true"></span>
            </div>
            <ul className="bg-rules">
              <li>PS5 sessions are for dine-in guests</li>
              <li>Please keep food &amp; drinks away from the console and controllers</li>
              <li>Handle equipment with care â report any issues to staff</li>
              <li>Session time may be limited during peak hours</li>
              <li>Please keep volume respectful of other guests</li>
              <li>Children should be supervised while playing</li>
              <li>Return controllers to staff when finished</li>
            </ul>
          </div>
        </section>

        <footer className="lounge-panel bg-footer">
          <div className="bg-footer__promo">
            <span className="bg-footer__trophy" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M8 4h8v3a4 4 0 0 1-8 0V4z" />
                <path d="M8 5H5.5a2.5 2.5 0 0 0 0 5H8M16 5h2.5a2.5 2.5 0 0 1 0 5H16" />
                <path d="M12 11v3M9 20h6M10 17h4v3h-4z" />
              </svg>
            </span>
            <div className="bg-footer__promo-copy">
              <strong>Game of the Week</strong>
              <p>Book a PS5 session this week and get <em>10% OFF</em> on any Mocktail!</p>
            </div>
          </div>

          <div className="bg-footer__featured">
            <div className="bg-footer__featured-media">
              <img
                src="assets/images/ps/fc25.webp"
                alt="EA Sports FC on PlayStation"
                width="144"
                height="144"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="bg-footer__featured-body">
              <span className="bg-footer__featured-label">Featured</span>
              <strong>EA SPORTS FC</strong>
              <p>Challenge friends on the pitch</p>
              <button type="button" className="bg-footer__play" id="ps-play-featured">Play Now</button>
            </div>
          </div>
        </footer>
        </main>
      </div>
    </>
  )
}
