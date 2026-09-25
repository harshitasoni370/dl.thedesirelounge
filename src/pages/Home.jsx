import { useEffect } from 'react'

export default function Home() {
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
          <!-- Hero -->
        <section className="lounge-hero" aria-labelledby="hero-heading">
          <p className="lounge-hero__welcome hero-anim">Welcome to</p>
          <h1 id="hero-heading" className="lounge-hero__title hero-anim">DESIRE<br /><span className="lounge-hero__subbrand">SHEESHA LOUNGE</span></h1>
          <p className="lounge-hero__subtitle hero-anim">Your Digital Lounge Experience</p>
          <p className="lounge-hero__copy hero-anim">
            Connect, explore and enjoy everything Desire Sheesha Lounge has to offer.
          </p>

        </section>

        <!-- Connect + Services -->
        <section className="lounge-explore hero-anim" id="services" aria-label="Connect and explore lounge services">
          <!-- <a
            href="https://thedesirelounge.com/#reserve"
            className="lounge-cta"
            id="connect"
            rel="noopener noreferrer"
          >
            <span className="lounge-cta__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <circle cx="12" cy="20" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <span className="lounge-cta__text">
              <strong>Connect &amp; Explore</strong>
              <small>Get Free Wi-Fi &amp; Discover More</small>
            </span>
            <span className="lounge-cta__chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </span>
          </a> -->

          <div className="lounge-services">
            <div className="lounge-services__grid">
              <a className="lounge-card" href="https://app.thedesirelounge.com/categories" rel="noopener noreferrer">
                <span className="lounge-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M4 11h16l-1.2 9.5a1.5 1.5 0 0 1-1.5 1.3H6.7a1.5 1.5 0 0 1-1.5-1.3L4 11z" />
                    <path d="M8 11V8.5A4 4 0 0 1 12 4.5a4 4 0 0 1 4 4V11" />
                    <path d="M9.5 14.5h5" />
                  </svg>
                </span>
                <h2>Menus</h2>
                <p>Explore our complete menu &amp; specials</p>
              </a>

              <a
                className="lounge-card"
                href="https://wa.me/971509002202?text=Hi%2C%20I%27d%20like%20the%20Wi-Fi%20details"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="lounge-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <circle cx="12" cy="20" r="1.15" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                <h2>Free Wi-Fi</h2>
                <p>High-speed internet for our guests</p>
              </a>

              <a className="lounge-card" href="https://thedesirelounge.com/live-sports">
                <span className="lounge-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8.2l2.4 1.7-.9 2.8H10.5l-.9-2.8L12 8.2z" />
                    <path d="M12 8.2V3.2M14.4 9.9l4.6-1.8M13.5 12.7l1.8 4.6M10.5 12.7l-1.8 4.6M9.6 9.9 5 8.1" />
                    <path d="M7.2 16.8 5 20.2M16.8 16.8 19 20.2M19.2 9.2l2.6-.2M4.8 9.2 2.2 9" />
                  </svg>
                </span>
                <h2>Live Sports</h2>
                <p>Today's matches &amp; schedules</p>
              </a>

              <a className="lounge-card" href="https://thedesirelounge.com/events">
                <span className="lounge-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" />
                    <path d="M19 11a7 7 0 0 1-14 0M12 18v3M9 21h6" />
                  </svg>
                </span>
                <h2>Events</h2>
                <p>14 August â Sufi Night with Wagashaider</p>
              </a>

              <a className="lounge-card" href="/exclusive-offers">
                <span className="lounge-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8" />
                    <path d="M2 7h20v5H2z" />
                    <path d="M12 22V7" />
                    <path d="M12 7c-1.8-2.4-4.5-3.2-6.5-2.4C3.5 5.4 3 7.2 4.2 8.5" />
                    <path d="M12 7c1.8-2.4 4.5-3.2 6.5-2.4 2 0.8 2.5 2.6 1.3 3.9" />
                  </svg>
                </span>
                <h2>Exclusive Offers</h2>
                <p>Sunday Brunch from AED 29 &amp; more</p>
              </a>

              <a className="lounge-card" href="/privilege-membership">
                <span className="lounge-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 3.2l1.9 4.7 5.1.4-3.9 3.2 1.2 4.9L12 13.9 7.7 16.4l1.2-4.9L5 8.3l5.1-.4L12 3.2z" />
                  </svg>
                </span>
                <h2>Desire Privilege<br />Membership</h2>
                <p>AED 199/year â 20% off every visit</p>
              </a>

              <a
                className="lounge-card"
                href="https://thedesirelounge.com/#reserve"
                rel="noopener noreferrer"
              >
                <span className="lounge-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M16 3v4M8 3v4M3 11h18" />
                    <circle cx="12" cy="16" r="2.2" />
                    <path d="M12 14.5V16l1 1" />
                  </svg>
                </span>
                <h2>Reserve a Table</h2>
                <p>Book your table in advance</p>
              </a>

              <a className="lounge-card" href="/playstation">
                <span className="lounge-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M6 10h12a2.5 2.5 0 0 1 2.5 2.5v3A2.5 2.5 0 0 1 18 18H6a2.5 2.5 0 0 1-2.5-2.5v-3A2.5 2.5 0 0 1 6 10z" />
                    <path d="M8.2 14.2v0M15.8 14.2v0" stroke-linecap="round" stroke-width="2.2" />
                    <path d="M10.5 13.2v2.2M13.5 13.2v2.2" stroke-linecap="round" />
                    <path d="M9 10V8.5a3 3 0 0 1 6 0V10" />
                  </svg>
                </span>
                <h2>PlayStation</h2>
                <p>PS5 gaming sessions for guests</p>
              </a>

              <a className="lounge-card" href="/board-games">
                <span className="lounge-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
                    <circle cx="9" cy="9" r="1.6" />
                    <circle cx="15" cy="9" r="1.6" />
                    <circle cx="9" cy="15" r="1.6" />
                    <circle cx="15" cy="15" r="1.6" />
                    <path d="M12 3.5v17M3.5 12h17" />
                  </svg>
                </span>
                <h2>Board Games</h2>
                <p>Classic &amp; new games to play</p>
              </a>

              <a className="lounge-card" href="/birthday-celebrations" id="celebrations">
                <span className="lounge-card__icon lounge-card__icon--filled" aria-hidden="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#F472B6" d="M11.2 2.2c.2-.5.8-.5 1 0l.35.9c.1.25.35.4.6.35l.95-.2c.5-.1.85.4.55.8l-.55.75c-.15.2-.15.5 0 .7l.55.75c.3.4-.05.9-.55.8l-.95-.2a.7.7 0 0 0-.6.35l-.35.9c-.2.5-.8.5-1 0l-.35-.9a.7.7 0 0 0-.6-.35l-.95.2c-.5.1-.85-.4-.55-.8l.55-.75c.15-.2.15-.5 0-.7l-.55-.75c-.3-.4.05-.9.55-.8l.95.2c.25.05.5-.1.6-.35l.35-.9z" />
                    <rect x="11.15" y="5.6" width="1.7" height="4.2" rx="0.85" fill="#FBBF24" />
                    <path fill="#F9A8D4" d="M4 11.2h16c0 1.4-1.2 2.5-2.6 2.5H6.6C5.2 13.7 4 12.6 4 11.2z" />
                    <path fill="#A78BFA" d="M4.5 13.7h15v3.2c0 .9-.7 1.6-1.6 1.6H6.1c-.9 0-1.6-.7-1.6-1.6v-3.2z" />
                    <path fill="#60A5FA" d="M4.5 16.9h15V20c0 .9-.7 1.6-1.6 1.6H6.1c-.9 0-1.6-.7-1.6-1.6v-3.1z" />
                    <circle cx="8" cy="15.3" r="0.85" fill="#FDF4FF" />
                    <circle cx="12" cy="15.3" r="0.85" fill="#FDF4FF" />
                    <circle cx="16" cy="15.3" r="0.85" fill="#FDF4FF" />
                    <circle cx="10" cy="18.5" r="0.85" fill="#FDF4FF" />
                    <circle cx="14" cy="18.5" r="0.85" fill="#FDF4FF" />
                  </svg>
                </span>
                <h2>Birthday Packages</h2>
                <p>Available</p>
              </a>

              <a className="lounge-card" href="/corporate-bookings">
                <span className="lounge-card__icon lounge-card__icon--filled" aria-hidden="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#94A3B8" d="M2.5 20.5h19v1.5H2.5z" />
                    <path fill="#3B82F6" d="M5 8.5h14v12H5z" />
                    <path fill="#1D4ED8" d="M8.5 4.2 12 2.2l3.5 2V8.5h-7V4.2z" />
                    <path fill="#93C5FD" d="M7.2 10.2h2.2v2.2H7.2zm3.7 0h2.2v2.2h-2.2zm3.7 0h2.2v2.2h-2.2zM7.2 13.8h2.2v2.2H7.2zm3.7 0h2.2v2.2h-2.2zm3.7 0h2.2v2.2h-2.2z" />
                    <path fill="#FBBF24" d="M10.2 17.2h3.6V20.5h-3.6z" />
                  </svg>
                </span>
                <h2>Corporate</h2>
                <p>Bookings Open</p>
              </a>

              <a className="lounge-card" href="/make-it-your-moment">
                <span className="lounge-card__icon lounge-card__icon--filled" aria-hidden="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <defs>
                      <linearGradient id="moment-heart" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FB7185" />
                        <stop offset="55%" stop-color="#E11D48" />
                        <stop offset="100%" stop-color="#BE123C" />
                      </linearGradient>
                    </defs>
                    <path
                      fill="url(#moment-heart)"
                      d="M12 21.2 6.4 15.8C4.2 13.7 3 11.8 3 9.4 3 5.8 5.8 3.2 9.1 3.2c1.7 0 3.2.8 4.1 2.1.9-1.3 2.4-2.1 4.1-2.1 3.3 0 6.1 2.6 6.1 6.2 0 2.4-1.2 4.3-3.4 6.4L12 21.2z"
                    />
                    <circle cx="9.1" cy="9.6" r="1.05" fill="#FEF2F2" opacity="0.9" />
                    <circle cx="14.9" cy="9.6" r="1.05" fill="#FEF2F2" opacity="0.9" />
                    <path
                      fill="none"
                      stroke="#FEF2F2"
                      stroke-width="1.35"
                      stroke-linecap="round"
                      d="M8.4 12.6c1.3 1.1 2.6 1.65 3.6 1.65s2.3-.55 3.6-1.65"
                    />
                    <path fill="#FBBF24" d="M18.6 4.1 19.4 6l2 .25-1.5 1.4.4 1.95-1.7-1-1.7 1 .4-1.95-1.5-1.4 2-.25z" />
                  </svg>
                </span>
                <h2>Make It Your<br />Moment</h2>
              </a>
            </div>
          </div>
        </section>

        <!-- Order Online -->
        <section className="lounge-panel lounge-panel--borderless" id="order-online" aria-labelledby="order-heading">
          <div className="lounge-panel__head">
            <span className="lounge-panel__rule" aria-hidden="true"></span>
            <h2 id="order-heading">Order Online</h2>
            <span className="lounge-panel__rule" aria-hidden="true"></span>
          </div>

          <div className="lounge-services">
            <div className="lounge-services__grid">
              <a
                className="lounge-card"
                href="https://www.talabat.com/uae/fumes-and-flavours"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="lounge-card__icon lounge-card__icon--logo" aria-hidden="true">
                  <img
                    src="assets/images/talabat.svg"
                    alt=""
                    width="56"
                    height="28"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <h2>Talabat</h2>
                <p>Order Now</p>
              </a>

              <a
                className="lounge-card"
                href="https://food.noon.com/en-ae/outlet/FMSNDF5UDU"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="lounge-card__icon lounge-card__icon--logo lounge-card__icon--noon" aria-hidden="true">
                  <img
                    src="assets/images/noon.avif"
                    alt=""
                    width="56"
                    height="28"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <h2>Noon</h2>
                <p>Order Now</p>
              </a>

              <a
                className="lounge-card"
                href="https://url-eu.mykeeta.com/utfRzGMz"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="lounge-card__icon lounge-card__icon--logo" aria-hidden="true">
                  <img
                    src="assets/images/keeta.png"
                    alt=""
                    width="56"
                    height="28"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <h2>Keeta</h2>
                <p>Order Now</p>
              </a>

              <a
                className="lounge-card"
                href="https://smiles.ae/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="lounge-card__icon lounge-card__icon--logo" aria-hidden="true">
                  <img
                    src="assets/images/smiles.png"
                    alt=""
                    width="56"
                    height="28"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <h2>Smiles</h2>
                <p>Order Now</p>
              </a>

              <a
                className="lounge-card"
                href="https://deliveroo.ae/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="lounge-card__icon lounge-card__icon--logo" aria-hidden="true">
                  <img
                    src="assets/images/deliveroo.png"
                    alt=""
                    width="56"
                    height="28"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <h2>Deliveroo</h2>
                <p>Order Now</p>
              </a>

              <a
                className="lounge-card"
                href="https://www.careem.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="lounge-card__icon lounge-card__icon--logo" aria-hidden="true">
                  <img
                    src="/assets/images/careem.avif"
                    alt=""
                    width="56"
                    height="28"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <h2>Careem</h2>
                <p>Order Now</p>
              </a>
            </div>
          </div>
        </section>

        <!-- Stay Connected -->
        <section className="lounge-panel" id="connect-social" aria-labelledby="connected-heading">
          <div className="lounge-panel__head">
            <span className="lounge-panel__rule" aria-hidden="true"></span>
            <h2 id="connected-heading">Stay Connected</h2>
            <span className="lounge-panel__rule" aria-hidden="true"></span>
          </div>

          <div className="lounge-social">
            <a
              className="lounge-social__item"
              href="https://www.instagram.com/desire_lounge_dubai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="lounge-social__icon lounge-social__icon--ig" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <defs>
                    <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
                      <stop offset="0%" stop-color="#fdf497" />
                      <stop offset="5%" stop-color="#fdf497" />
                      <stop offset="45%" stop-color="#fd5949" />
                      <stop offset="60%" stop-color="#d6249f" />
                      <stop offset="90%" stop-color="#285AEB" />
                    </radialGradient>
                  </defs>
                  <path
                    fill="url(#ig-grad)"
                    d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.52.01-4.76.07-2.23.1-3.27 1.15-3.37 3.37-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.1 2.22 1.14 3.26 3.37 3.37 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c2.23-.1 3.27-1.15 3.37-3.37.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.1-2.22-1.14-3.26-3.37-3.37-1.24-.06-1.61-.07-4.76-.07zm0 3.06a5.14 5.14 0 1 1 0 10.28 5.14 5.14 0 0 1 0-10.28zm0 8.47a3.33 3.33 0 1 0 0-6.66 3.33 3.33 0 0 0 0 6.66zm6.54-8.71a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"
                  />
                </svg>
              </span>
              <strong>Instagram</strong>
              <span>Follow Us</span>
            </a>

            <a
              className="lounge-social__item"
              href="https://www.facebook.com/desiresheeshalounge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="lounge-social__icon lounge-social__icon--fb" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#1877F2"
                    d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
                  />
                </svg>
              </span>
              <strong>Facebook</strong>
              <span>Follow Us</span>
            </a>

            <a
              className="lounge-social__item"
              href="https://www.tiktok.com/@desiresheshalounge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="lounge-social__icon lounge-social__icon--tiktok" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#25F4EE"
                    d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.16 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.2 8.2 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1.01-.15z"
                    transform="translate(-1.1, 0.6)"
                  />
                  <path
                    fill="#FE2C55"
                    d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.16 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.2 8.2 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1.01-.15z"
                    transform="translate(1.1, -0.6)"
                  />
                  <path
                    fill="#fff"
                    d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.16 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.2 8.2 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1.01-.15z"
                  />
                </svg>
              </span>
              <strong>TikTok</strong>
              <span>Follow Us</span>
            </a>

            <a
              className="lounge-social__item"
              href="https://wa.me/971509002202"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="lounge-social__icon lounge-social__icon--wa" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#25D366"
                    d="M12 2C6.48 2 2 6.28 2 11.55c0 1.87.55 3.62 1.5 5.12L2 22l5.55-1.45A10.3 10.3 0 0 0 12 21.1c5.52 0 10-4.28 10-9.55S17.52 2 12 2z"
                  />
                  <path
                    fill="#fff"
                    d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"
                  />
                </svg>
              </span>
              <strong>WhatsApp</strong>
              <span>Chat With Us</span>
            </a>

            <a
              className="lounge-social__item"
              href="https://g.page/r/CTqZiSxwUeXCEBM/review"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="lounge-social__icon lounge-social__icon--google" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09A6.97 6.97 0 0 1 5.48 12c0-.72.13-1.42.36-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </span>
              <strong>Google<br /> Reviews</strong>
              <span>Rate Us</span>
            </a>

            <a
              className="lounge-social__item"
              href="https://maps.app.goo.gl/ZEzx6gWvyjT3cqzB7"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="lounge-social__icon lounge-social__icon--maps" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#E53935"
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  />
                  <circle fill="#B71C1C" cx="12" cy="9" r="2.75" />
                </svg>
              </span>
              <strong>Google<br /> Maps</strong>
              <span>Find Us</span>
            </a>
          </div>
        </section>

        <!-- Exclusive -->
        <!-- <section className="lounge-panel" id="exclusive" aria-labelledby="exclusive-heading">
          <div className="lounge-panel__head">
            <span className="lounge-panel__rule" aria-hidden="true"></span>
            <h2 id="exclusive-heading">Exclusive</h2>
            <span className="lounge-panel__rule" aria-hidden="true"></span>
          </div>

          <div className="lounge-highlights lounge-highlights--two">
            <a className="lounge-highlight" href="/privilege-membership">
              <span className="lounge-highlight__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 3.2l1.9 4.7 5.1.4-3.9 3.2 1.2 4.9L12 13.9 7.7 16.4l1.2-4.9L5 8.3l5.1-.4L12 3.2z" />
                </svg>
              </span>
              <strong>Desire Privilege<br />Membership</strong>
            </a>
          </div>
        </section> -->

        <!-- Today's Highlights -->
        <!-- <section className="lounge-panel" id="highlights" aria-labelledby="highlights-heading">
          <div className="lounge-panel__head">
            <span className="lounge-panel__rule" aria-hidden="true"></span>
            <h2 id="highlights-heading">Today's Highlights</h2>
            <span className="lounge-panel__rule" aria-hidden="true"></span>
          </div>

          <div className="lounge-highlights">
            <a className="lounge-highlight" href="https://thedesirelounge.com/events">
              <span className="lounge-highlight__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 11h16l-1.2 9.5a1.5 1.5 0 0 1-1.5 1.3H6.7a1.5 1.5 0 0 1-1.5-1.3L4 11z" />
                  <path d="M8 11V8.5A4 4 0 0 1 12 4.5a4 4 0 0 1 4 4V11" />
                  <path d="M9.5 14.5h5" />
                </svg>
              </span>
              <strong>Sunday Brunch</strong>
              <span>Every Sunday | 12 PM â 5 PM</span>
              <small>From AED 29</small>
            </a>

            <article className="lounge-highlight">
              <span className="lounge-highlight__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 3v3" />
                  <path d="M9.5 6h5" />
                  <path d="M10 6c0 2.5-2 4-2 6.5a4 4 0 0 0 8 0C16 10 14 8.5 14 6" />
                  <path d="M8 20h8" />
                  <path d="M10 16.5c.5 1.2 1.2 2 2 2s1.5-.8 2-2" />
                </svg>
              </span>
              <strong>Shisha of the Day</strong>
              <span>Paan Kiwi</span>
              <small>AED 29</small>
            </article>

            <article className="lounge-highlight">
              <span className="lounge-highlight__icon lounge-highlight__icon--offer" aria-hidden="true">
                <em className="lounge-badge lounge-badge--offer">BOGO</em>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M8 21h8M12 17v4M8 3v5a4 4 0 0 0 8 0V3" />
                  <path d="M8 3h8" />
                  <path d="M7 8h10" />
                </svg>
              </span>
              <strong>Mocktail Special</strong>
              <span>Buy 1 Get 1 Free</span>
              <small>4 PMâ7 PM</small>
            </article>

            <article className="lounge-highlight">
              <span className="lounge-highlight__icon lounge-highlight__icon--music" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 11h16l-1.2 9.5a1.5 1.5 0 0 1-1.5 1.3H6.7a1.5 1.5 0 0 1-1.5-1.3L4 11z" />
                  <path d="M8 11V8.5A4 4 0 0 1 12 4.5a4 4 0 0 1 4 4V11" />
                  <path d="M9.5 14.5h5" />
                </svg>
              </span>
              <strong>Chef's Recommendation</strong>
              <span>Butter Chicken + 2 Butter Naan</span>
              <small>AED 35</small>
            </article>

          </div>
        </section> -->
        </main>
      </div>
    </>
  )
}
