import { useEffect } from 'react'

export default function Terms() {
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
          <section className="offer-sheet__panel" aria-labelledby="terms-title">
            <header className="offer-sheet__banner">
              <span className="lounge-panel__rule" aria-hidden="true"></span>
              <h1 id="terms-title">Terms &amp; Conditions</h1>
              <span className="lounge-panel__rule" aria-hidden="true"></span>
            </header>

            <p className="offer-sheet__tagline">House rules for Eat. Chill. Play.</p>

            <p className="offer-sheet__copy offer-sheet__copy--lead">
              These terms apply when you visit Desire Sheesha Lounge, use our Digital Lounge,
              connect to guest Wi-Fi, reserve a table, or book events, memberships and gaming
              at our 24/7 lounge in Deira, Dubai.
            </p>

            <div className="legal-doc">
              <section className="legal-doc__block" id="who-we-are">
                <h2>1. Who we are</h2>
                <p>
                  DESIRE SHEESHA LOUNGE (âweâ, âusâ, âourâ) is a 24-hour
                  destination in Deira, Dubai offering premium lounge dining, multi-cuisine food,
                  live sports, a gaming zone and shisha.
                </p>
                <p>
                  Venue:
                  <a href="https://maps.app.goo.gl/ZEzx6gWvyjT3cqzB7" target="_blank" rel="noopener noreferrer">
                    Ground Floor, Green Tower, Baniyas Road, Riggat Al Buteen, Deira, Dubai, UAE
                  </a>.
                </p>
                <p>
                  Website:
                  <a href="https://thedesirelounge.com/" rel="noopener noreferrer">thedesirelounge.com</a>.
                  Digital Lounge: this page and related lounge screens in-venue.
                </p>
              </section>

              <section className="legal-doc__block" id="acceptance">
                <h2>2. Acceptance of these terms</h2>
                <p>
                  By continuing on the Digital Lounge, connecting to our Wi-Fi, placing a
                  reservation, ordering, or dining with us, you agree to these Terms &amp;
                  Conditions and our
                  <a href="/privacy">Privacy Policy</a>.
                  If you do not agree, please do not use the Digital Lounge or guest network.
                </p>
                <p>
                  We may update these terms from time to time. The latest version will always be
                  available from the Digital Lounge footer. Continued use after an update means
                  you accept the revised terms.
                </p>
              </section>

              <section className="legal-doc__block" id="wifi">
                <h2>3. Digital Lounge &amp; guest Wi-Fi</h2>
                <p>
                  Guest Wi-Fi is provided free of charge for customers while on the premises, as
                  a courtesy and subject to availability. Access is not guaranteed and may be
                  paused for maintenance, capacity or security reasons.
                </p>
                <ul>
                  <li>Use the network lawfully and respectfully. Do not attempt to bypass filters, scan the network, or access other guestsâ devices.</li>
                  <li>Do not stream, share or download unlawful, harmful or copyright-infringing content.</li>
                  <li>We may log limited connection data (such as device identifiers and session times) to keep the network secure.</li>
                  <li>You remain responsible for anything done through your device while connected.</li>
                </ul>
              </section>

              <section className="legal-doc__block" id="reservations">
                <h2>4. Reservations</h2>
                <p>
                  Tables can be reserved through
                  <a href="https://thedesirelounge.com/#reserve" rel="noopener noreferrer">thedesirelounge.com</a>,
                  WhatsApp, or in person. We confirm bookings on WhatsApp at
                  <a href="https://wa.me/971509002202">+971 50 900 2202</a>.
                </p>
                <ul>
                  <li>Please provide accurate name, phone, guest count, date and time. Date of birth may be requested for age-restricted services and birthday benefits.</li>
                  <li>A reservation holds a table for a reasonable arrival window. Please tell us if you are running late.</li>
                  <li>We may release unclaimed tables during peak hours, match nights or events.</li>
                  <li>Large groups, birthday packages and corporate bookings may require advance notice and a deposit, as agreed with management.</li>
                  <li>We are open 24/7, but specific seating, screens or packages remain subject to availability.</li>
                </ul>
              </section>

              <section className="legal-doc__block" id="dining">
                <h2>5. Dining, menu &amp; pricing</h2>
                <p>
                  Our menu covers Indian favourites, Indo-Chinese, biryani, street food, mocktails
                  and desserts, with 250+ veg and non-veg items. Prices, items and availability
                  can change. The price charged is the price displayed or confirmed at the time of
                  order.
                </p>
                <ul>
                  <li>Allergen information is available on request. Please tell your server about allergies before ordering.</li>
                  <li>Outside food and beverages are not permitted unless management has approved a celebration cake or similar item.</li>
                  <li>Online delivery via Talabat, Noon, Keeta, Smiles, Deliveroo or Careem is fulfilled under those platformsâ own terms.</li>
                  <li>Payment may be made by cash or card as offered at the venue.</li>
                </ul>
              </section>

              <section className="legal-doc__block" id="offers">
                <h2>6. Offers, events &amp; packages</h2>
                <p>
                  Sunday Brunch, exclusive offers, ladiesâ night, match nights, live events,
                  birthday packages, corporate bookings and âMake It Your Momentâ experiences are
                  subject to the details published on each page and any extra conditions stated at
                  booking.
                </p>
                <ul>
                  <li>Offers cannot usually be combined with other promotions, set menus or event packages unless we say otherwise.</li>
                  <li>Event line-ups, timings and talent may change. We will update guests where reasonably possible.</li>
                  <li>Management may refuse or end an offer if it is misused or if venue capacity or safety requires it.</li>
                </ul>
              </section>

              <section className="legal-doc__block" id="shisha">
                <h2>7. Shisha &amp; age restrictions</h2>
                <p>
                  Premium shisha is available to guests who meet the minimum age required under
                  UAE law (currently 18 years, or any higher age that applies). Staff may request
                  valid photo ID. We may refuse service without ID or where service would breach
                  the law.
                </p>
                <p>
                  Shisha flavours, session pricing and âshisha of the dayâ offers are subject to
                  availability. Please use shisha equipment carefully and follow staff guidance.
                </p>
              </section>

              <section className="legal-doc__block" id="gaming">
                <h2>8. Gaming zone</h2>
                <p>
                  PlayStation (PS5), board games and the big-screen gaming experience are provided
                  for guests to enjoy on the premises. Sessions may be time-limited during busy
                  periods or tournaments.
                </p>
                <ul>
                  <li>Treat consoles, controllers and games with care. Damage caused by misuse may be charged.</li>
                  <li>Gaming is a shared space â keep volume, language and behaviour respectful.</li>
                  <li>Save your own progress where possible. We are not responsible for lost game data or personal accounts used on venue devices.</li>
                </ul>
              </section>

              <section className="legal-doc__block" id="membership">
                <h2>9. Desire Privilege membership</h2>
                <p>
                  Annual membership is currently offered at AED 199 per year, with member benefits
                  such as 20% off eligible dine-in food, beverages and shisha, plus priority
                  reservations and members-only offers, as described on the membership page.
                </p>
                <ul>
                  <li>Benefits apply to the named member and are generally for dine-in only.</li>
                  <li>Membership is typically not combinable with other promotions, set menus or special-event packages.</li>
                  <li>We may update benefits, exclusions and redemption rules. Material changes will be communicated where practical.</li>
                </ul>
              </section>

              <section className="legal-doc__block" id="conduct">
                <h2>10. Guest conduct &amp; venue rules</h2>
                <p>
                  We want Desire Sheesha Lounge to feel welcoming at any hour. Please respect staff,
                  other guests and the space.
                </p>
                <ul>
                  <li>Follow UAE law, including rules on dress, public behaviour and smoking areas.</li>
                  <li>Do not harass staff or guests, damage property, or occupy tables without ordering during peak times when asked to make space.</li>
                  <li>Photography and filming for personal use is generally welcome. Commercial shoots need prior approval. Please do not photograph other guests without consent.</li>
                  <li>We may refuse entry, end a visit, or restrict Wi-Fi if these rules are broken or if safety requires it.</li>
                </ul>
              </section>

              <section className="legal-doc__block" id="liability">
                <h2>11. Liability</h2>
                <p>
                  We take care to provide a safe, enjoyable venue. To the fullest extent allowed
                  by UAE law, we are not liable for loss or damage arising from Wi-Fi use, lost
                  belongings, third-party delivery platforms, or events outside our reasonable
                  control. Nothing in these terms limits liability that cannot be limited by law,
                  including for death or personal injury caused by our negligence where such a
                  limit is not permitted.
                </p>
                <p>
                  Please keep valuables with you. The venue is not a cloakroom unless a specific
                  arrangement is made with management.
                </p>
              </section>

              <section className="legal-doc__block" id="ip">
                <h2>12. Intellectual property</h2>
                <p>
                  The Desire Sheesha Lounge name, logo, menu design, Digital Lounge content,
                  photographs and branding are owned by us or our licensors. You may not copy or
                  reuse them for commercial purposes without written permission.
                </p>
              </section>

              <section className="legal-doc__block" id="law">
                <h2>13. Governing law</h2>
                <p>
                  These terms are governed by the laws of the United Arab Emirates as applied in
                  the Emirate of Dubai. Any dispute will be subject to the exclusive jurisdiction
                  of the courts of Dubai, unless a mandatory consumer protection rule says
                  otherwise.
                </p>
              </section>

              <section className="legal-doc__block" id="contact">
                <h2>14. Contact</h2>
                <div className="legal-doc__contact">
                  <p>Questions about these terms? Reach the team any time â we are open 24/7.</p>
                  <p>
                    WhatsApp / phone:
                    <a href="tel:+971509002202">+971 50 900 2202</a>
                    Â·
                    <a href="https://wa.me/971509002202" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
                  </p>
                  <p>
                    Address: Ground Floor, Green Tower, Baniyas Road, Riggat Al Buteen, Deira, Dubai
                  </p>
                  <p>
                    Website:
                    <a href="https://thedesirelounge.com/" rel="noopener noreferrer">thedesirelounge.com</a>
                  </p>
                </div>
              </section>

              <div className="legal-doc__switch">
                <a className="offer-sheet__cta" href="/privacy">Read Privacy Policy</a>
              </div>
            </div>

            <p className="offer-sheet__brand">DESIRE SHEESHA LOUNGE â¢ Deira, Dubai</p>
          </section>
        </article>
        </main>
      </div>
    </>
  )
}
