import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectQrContext } from "../store/slices/qrContextSlice";

const offers = [
  {
    name: "Ladies Exclusive - Complimentary Shisha",
    meta: "A little something special, just for her.",
    description: "Ladies can enjoy one complimentary standard shisha from our selected flavours, subject to the terms below.",
    featured: true,
    details: [
      "One complimentary standard shisha per eligible lady.",
      "Choice from selected standard flavours only.",
      "Regular charcoal replacement is included during the session.",
      "Premium, special and signature shishas/flavours are excluded.",
    ],
  },
  {
    name: "Sunday Brunch - From AED 29/person",
    meta: "Every Sunday | 12 PM - 5 PM",
    description: "Classic Brunch AED 29 - Classic + Shisha AED 59 - Premium Sunday AED 129. Includes board games, PlayStation and live sports where scheduled.",
    featured: true,
  },
  { name: "Breakfast - AED 12", meta: "Daily | 8:00 AM - 10:00 AM", description: "Choose a selected breakfast combination: Samosa + Kadak Tea - Bun Maska/Bread Butter + Kadak Tea - Paratha + Kadak Tea - Bread Omelette + Kadak Tea - Egg Roll + Kadak Tea." },
  { name: "Shisha Happy Hours - AED 20", description: "Selected shisha flavours | 8:00 AM - 11:00 AM and 4:00 PM - 6:00 PM." },
  { name: "Food + Shisha Combo - AED 59", description: "1 basic-flavour shisha + one selected item: Samosa Chaat / French Fries / Dahi Puri / Momo / Pasta / Chilli Chicken / Chilli Paneer." },
  { name: "Shisha + Drink - AED 49", description: "1 basic-flavour shisha + selected Mojito / Fresh Milk Tea / Coffee / Lemon Drink." },
  { name: "Come Back Offer - 20% Off Your Next Visit", description: "For first-time customers returning for their next visit. Applicable terms and conditions should be communicated at redemption." },
  { name: "Review & Follow - A Little Thank-You From Us", description: "Share your honest Google feedback, follow us on Instagram and TikTok, or explore our online ordering platforms. Complimentary chocolates may be offered subject to availability." },
];

function getContext(search, qrContext) {
  const params = new URLSearchParams(search);
  const data = qrContext?.data || {};
  return {
    companyId: data.companyId || params.get("companyId") || "",
    branchId: data.branchId || params.get("branchId") || "",
    sessionId: data.tableSessionId || data.sessionId || params.get("sessionId") || "",
    tableSessionId: data.tableSessionId || data.sessionId || params.get("tableSessionId") || params.get("sessionId") || "",
    tableId: data.tableId || params.get("tableId") || "",
    tableNumber: data.tableNumber || data.tableNo || params.get("tableNumber") || params.get("tableNo") || params.get("name") || "",
    moduleId: data.moduleId || params.get("moduleId") || "3e340f23-d842-47f0-98e8-b0d458dc22dd",
  };
}

export default function ExclusiveOffersPage() {
  const location = useLocation();
  const qrContext = useSelector(selectQrContext);
  const [selected, setSelected] = useState(null);
  const context = getContext(location.search, qrContext);

  const checkout = () => {
    if (selected === null) return;
    const offer = offers[selected];
    const price = offer.name.match(/AED\s*[\d.]+|\d+%|Complimentary/i)?.[0] || "";
    const details = { id: offer.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: offer.name, price, description: offer.description, type: "exclusive-offer" };
    const params = new URLSearchParams({
      companyId: context.companyId,
      branchId: context.branchId,
      sessionId: context.sessionId,
      tableSessionId: context.tableSessionId,
      ...(context.tableId ? { tableId: context.tableId } : {}),
      ...(context.tableNumber ? { tableNumber: context.tableNumber } : {}),
      categoryName: "Exclusive Offers",
      category: "EXCLUSIVE_OFFER",
      reservationCategory: "EXCLUSIVE_OFFER",
      eventName: offer.name,
      offerId: details.id,
      offerName: offer.name,
      offerDescription: offer.description,
      offerPrice: price,
      bookingType: "Exclusive Offer",
      reservationTitle: offer.name,
      price: price.replace(/[^\d.]/g, ""),
      extraDetails: JSON.stringify(details),
      step: "about-you",
      hideSteps: "true",
      hideCardIcon: "true",
    });
    window.location.assign(`https://app.thedesirelounge.com/checkout?${params}`);
  };

  return (
    <div className="lounge-page offer-page">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="lounge-bg" aria-hidden="true"><div className="lounge-bg__image" style={{ backgroundImage: "url('/assets/images/index-hero-bg.webp')" }} /><div className="lounge-bg__overlay" /></div>
      <div className="lounge-shell bg-games-shell" id="app">
        <header className="lounge-header">
          <a href="/" className="logo lounge-header__logo" aria-label="DESIRE SHEESHA LOUNGE home">
            <img src="https://restaurents-api.cylsys.com/Assets/theDesireLounge/Image/Logo/logo.webp" alt="" className="logo__mark" width="48" height="48" />
            <span className="logo__copy"><span className="logo__text">DESIRE</span><span className="logo__tag">SHEESHA LOUNGE</span></span>
          </a>
          <div className="lounge-header__actions">
            <a href="/#services" className="bg-games-back" aria-label="Back to Digital Lounge"><span>Lounge</span></a>
            <button type="button" className="lounge-header__menu" aria-label="Open menu"><span></span><span></span><span></span></button>
          </div>
        </header>
        <main id="main" className="lounge-main bg-games-main">
          <article className="offer-sheet"><section className="offer-sheet__panel" aria-labelledby="offers-title">
            <header className="offer-sheet__banner"><span className="lounge-panel__rule" /><h1 id="offers-title">Exclusive Offers</h1><span className="lounge-panel__rule" /></header>
            <p className="offer-sheet__tagline">More Reasons to Visit. More Reasons to Stay.</p>
            <div className="offer-packages">
              {offers.map((offer, index) => <article key={offer.name} className={`offer-package${offer.featured ? " offer-package--featured" : ""}${selected === index ? " is-selected" : ""}`} role="button" tabIndex="0" aria-pressed={selected === index} onClick={() => setSelected(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelected(index); } }}>
                <h2>{offer.name}</h2>
                {offer.meta && <p className="offer-package__meta">{offer.meta}</p>}
                <p>{offer.description}</p>
                {offer.details && <><h3 className="offer-package__subheading">What's Included</h3><ul className="offer-sheet__benefits">{offer.details.map((detail) => <li key={detail}>{detail}</li>)}</ul><h3 className="offer-package__subheading">Offer Terms</h3><ul className="offer-sheet__benefits"><li>Offer is non-transferable and cannot be exchanged for cash or another product.</li><li>Cannot be combined with another promotion unless management permits it.</li><li>Offer is subject to availability and applicable UAE legal age requirements.</li><li>Management reserves the right to amend or withdraw the offer.</li></ul></>}
              </article>)}
            </div>
            <button type="button" className="offer-sheet__cta" disabled={selected === null} onClick={checkout}>{selected === null ? "Select an offer first" : `Book ${offers[selected].name}`}</button>
            <p className="offer-sheet__brand">Desire Sheesha Lounge - Customer Offers &amp; Packages</p>
          </section></article>
        </main>
      </div>
    </div>
  );
}
