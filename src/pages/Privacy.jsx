import { useEffect } from 'react'

export default function Privacy() {
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
          <section className="offer-sheet__panel" aria-labelledby="privacy-title">
            <header className="offer-sheet__banner">
              <span className="lounge-panel__rule" aria-hidden="true"></span>
              <h1 id="privacy-title">Privacy Policy</h1>
              <span className="lounge-panel__rule" aria-hidden="true"></span>
            </header>

            <p className="offer-sheet__tagline">We respect your privacy.</p>

            <p className="offer-sheet__copy offer-sheet__copy--lead">
              This policy explains how Desire Sheesha Lounge collects, uses and protects personal
              information when you visit our lounge, use the Digital Lounge, connect to guest
              Wi-Fi, reserve a table, join Desire Privilege, or contact us.
            </p>

            <div className="legal-doc">
              <section className="legal-doc__block" id="controller">
                <h2>1. Who is responsible</h2>
                <p>
                  DESIRE SHEESHA LOUNGE is the controller of personal data
                  collected through our venue, Digital Lounge, website and WhatsApp.
                </p>
                <p>
                  Venue: Ground Floor, Green Tower, Baniyas Road, Riggat Al Buteen, Deira, Dubai,
                  UAE. Phone / WhatsApp:
                  <a href="tel:+971509002202">+971 50 900 2202</a>.
                </p>
                <p>
                  We handle personal data in line with the UAE Federal Decree-Law No. 45 of 2021
                  on the Protection of Personal Data (PDPL) and other applicable UAE laws.
                </p>
              </section>

              <section className="legal-doc__block" id="collect">
                <h2>2. Information we collect</h2>
                <p>Depending on how you interact with us, we may collect:</p>
                <ul>
                  <li><strong>Reservations:</strong> full name, phone number, date of birth, number of guests, reservation date and time, and any special request you add.</li>
                  <li><strong>WhatsApp &amp; phone:</strong> messages, call notes and the number you use to reach us.</li>
                  <li><strong>Membership &amp; offers:</strong> name, phone, visit history needed to apply Desire Privilege or birthday benefits.</li>
                  <li><strong>Events &amp; celebrations:</strong> booking details, guest counts, dÃ©cor notes, and photos or videos you ask us to display on our screens.</li>
                  <li><strong>Digital Lounge &amp; Wi-Fi:</strong> device identifiers, connection times and basic usage logs needed to run a secure guest network.</li>
                  <li><strong>Reviews &amp; social:</strong> content you choose to share on Google, Instagram or TikTok, which those platforms also process under their own policies.</li>
                  <li><strong>Payments:</strong> we do not store full card numbers. Card payments are processed by our payment terminals or banks.</li>
                </ul>
                <p>
                  We do not ask for more than we need. If a field is optional (for example a
                  special request), you can leave it blank.
                </p>
              </section>

              <section className="legal-doc__block" id="use">
                <h2>3. How we use your information</h2>
                <ul>
                  <li>Confirm and manage table reservations, usually on WhatsApp.</li>
                  <li>Provide guest Wi-Fi and Digital Lounge access, and keep the network secure.</li>
                  <li>Fulfil dine-in orders, events, birthday packages, corporate bookings and memberships.</li>
                  <li>Verify age for shisha and other age-restricted services.</li>
                  <li>Send booking updates, and â only where you have asked us to â offers or event news.</li>
                  <li>Improve service, handle complaints, and protect guests, staff and the venue.</li>
                  <li>Meet legal, accounting and regulatory duties in the UAE.</li>
                </ul>
                <p>
                  We do not sell your personal information. Marketing messages are optional; you
                  can opt out by telling us on WhatsApp.
                </p>
              </section>

              <section className="legal-doc__block" id="legal-basis">
                <h2>4. Why we are allowed to use it</h2>
                <p>Under the PDPL we rely on one or more of the following:</p>
                <ul>
                  <li><strong>Your consent</strong> â for example connecting to Wi-Fi, submitting a reservation, or agreeing to offers.</li>
                  <li><strong>Contract</strong> â to complete a booking, membership or event package you requested.</li>
                  <li><strong>Legitimate interests</strong> â venue security, Wi-Fi integrity, and improving the guest experience, balanced against your rights.</li>
                  <li><strong>Legal obligation</strong> â where UAE law requires us to keep records or verify age.</li>
                </ul>
              </section>

              <section className="legal-doc__block" id="share">
                <h2>5. Who we share it with</h2>
                <p>We only share personal data when needed:</p>
                <ul>
                  <li><strong>Staff &amp; operations</strong> â to seat you, confirm bookings and run events.</li>
                  <li><strong>WhatsApp / Meta</strong> â if you message us there, that chat is also processed by WhatsApp under its terms.</li>
                  <li><strong>Delivery platforms</strong> â Talabat, Noon, Keeta, Smiles, Deliveroo or Careem process their own checkout data when you order through them.</li>
                  <li><strong>IT &amp; payment providers</strong> â hosting, Wi-Fi equipment and card terminals that help us operate.</li>
                  <li><strong>Authorities</strong> â if UAE law requires disclosure.</li>
                </ul>
                <p>
                  Third-party websites linked from the Digital Lounge (including
                  <a href="https://thedesirelounge.com/" rel="noopener noreferrer">thedesirelounge.com</a>
                  and social profiles) have their own privacy notices.
                </p>
              </section>

              <section className="legal-doc__block" id="cookies">
                <h2>6. Cookies &amp; Digital Lounge technology</h2>
                <p>
                  The Digital Lounge uses essential storage so pages load correctly, menus and
                  forms work, and your session stays usable on lounge devices. We do not use this
                  screen to run advertising profiles.
                </p>
                <p>
                  Our public website and partners may use analytics or advertising cookies. Where
                  those tools are used, they should only run after any required consent. You can
                  control cookies in your browser settings.
                </p>
              </section>

              <section className="legal-doc__block" id="retention">
                <h2>7. How long we keep it</h2>
                <p>
                  We keep reservation and WhatsApp details for as long as needed to complete your
                  visit and handle follow-up, then for a limited period for operations, accounting
                  and dispute handling. Membership records are kept for the membership term and a
                  short period after it ends. Wi-Fi logs are kept only as long as needed for
                  security. When data is no longer required, we delete or anonymise it.
                </p>
              </section>

              <section className="legal-doc__block" id="rights">
                <h2>8. Your rights</h2>
                <p>Subject to UAE PDPL and any legal exceptions, you may ask us to:</p>
                <ul>
                  <li>Access the personal data we hold about you.</li>
                  <li>Correct inaccurate information.</li>
                  <li>Erase data we no longer need.</li>
                  <li>Restrict or object to certain processing.</li>
                  <li>Withdraw consent, including marketing or optional Wi-Fi use.</li>
                </ul>
                <p>
                  Contact us on WhatsApp or at the venue. We may need to verify your identity
                  before fulfilling a request. You may also have the right to raise a concern with
                  the UAE Data Office.
                </p>
              </section>

              <section className="legal-doc__block" id="children">
                <h2>9. Children</h2>
                <p>
                  Our lounge welcomes families, but shisha and some packages are for adults.
                  Reservation forms may collect date of birth to confirm eligibility and birthday
                  benefits. We do not knowingly use childrenâs data for marketing. A parent or
                  guardian should make bookings that include minors.
                </p>
              </section>

              <section className="legal-doc__block" id="security">
                <h2>10. Security</h2>
                <p>
                  We use reasonable technical and organisational measures to keep guest
                  information safe â including limiting staff access, using trusted payment
                  terminals, and securing the guest Wi-Fi environment. No method of transmission
                  is completely secure; please avoid sending sensitive documents over WhatsApp
                  unless necessary.
                </p>
              </section>

              <section className="legal-doc__block" id="transfers">
                <h2>11. International transfers</h2>
                <p>
                  Some tools we use (for example WhatsApp or cloud hosting) may process data
                  outside the UAE. Where that happens, we rely on appropriate safeguards and the
                  providersâ contractual protections.
                </p>
              </section>

              <section className="legal-doc__block" id="changes">
                <h2>12. Changes to this policy</h2>
                <p>
                  We may update this Privacy Policy as our services or the law change. The current
                  version will always be linked from the Digital Lounge footer.
                </p>
              </section>

              <section className="legal-doc__block" id="contact">
                <h2>13. Contact</h2>
                <div className="legal-doc__contact">
                  <p>For privacy questions or data requests, message the Desire Sheesha Lounge team.</p>
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
                <a className="offer-sheet__cta" href="/terms">Read Terms &amp; Conditions</a>
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
