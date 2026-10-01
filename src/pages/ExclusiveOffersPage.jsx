import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectQrContext, selectDeviceId } from "../store/slices/qrContextSlice";
import { selectPackageModule, fetchPackageModuleItems } from "../store/slices/packageSlice";
import { MODULE_IDS } from "../config/urls";
import { useEffect } from "react";

const staticOffers = [
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

function buildOffersFromPackages(packages) {
  if (!packages || !packages.length) return [];

  return packages.map((pkg) => {
    const children = Array.isArray(pkg.children)
      ? pkg.children.map((child) => ({
          uidPackageItemId:
            child.uidPackageId || child.uidPackageItemId,

          uidParentPackageItemId:
            child.uidParentPackageItemId,

          uidHeaderModuleId:
            child.moduleId || child.uidHeaderModuleId,

          name: child.name,

          meta: child.timing || child.subtitle,

          timing: child.timing,

          description: child.description,

          details: child.inclusions || [],

          terms: child.terms || [],

          priceLabel:
            child.priceLabel || child.strPriceLabel,

          price:
            child.price ?? child.decPrice,

          uidPackageId:
            child.uidPackageId || child.uidPackageItemId,

          moduleId:
            child.moduleId || child.uidHeaderModuleId,

          imageUrl: child.imageUrl,

          isParent: false,
        }))
      : [];

    return {
      uidPackageItemId:
        pkg.uidPackageId || pkg.uidPackageItemId,

      uidParentPackageItemId:
        pkg.uidParentPackageItemId,

      uidHeaderModuleId:
        pkg.moduleId || pkg.uidHeaderModuleId,

      name: pkg.name,

      meta: pkg.timing || pkg.subtitle,

      timing: pkg.timing,

      description: pkg.description,

      featured:
        pkg.featured || children.length > 0,

      details: pkg.inclusions || [],

      terms: pkg.terms || [],

      priceLabel:
        pkg.priceLabel || pkg.strPriceLabel,

      price:
        pkg.price ?? pkg.decPrice,

      uidPackageId:
        pkg.uidPackageId || pkg.uidPackageItemId,

      moduleId:
        pkg.moduleId || pkg.uidHeaderModuleId,

      imageUrl: pkg.imageUrl,

      isParent: children.length > 0,

      children,
    };
  });
}

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
    moduleId: data.moduleId || params.get("moduleId") || MODULE_IDS.exclusiveOffers,
  };
}

export default function ExclusiveOffersPage() {
  const location = useLocation();
  const dispatch = useDispatch();
  const qrContext = useSelector(selectQrContext);
  const deviceId = useSelector(selectDeviceId);
  const packageModuleState = useSelector(selectPackageModule);
  const [selected, setSelected] = useState(null);
  const [expandedOffers, setExpandedOffers] = useState({});
  
  const context = getContext(location.search, qrContext);

  const searchWithDevice = (() => {
    const params = new URLSearchParams(location.search);
    if (deviceId) params.set("deviceId", deviceId);
    return `?${params.toString()}`;
  })();

  useEffect(() => {
    const urlModuleId = new URLSearchParams(location.search).get("moduleId");
    dispatch(
      fetchPackageModuleItems({
        search: searchWithDevice,
        qrContext,
        overrides: { moduleId: urlModuleId || MODULE_IDS.exclusiveOffers },
      }),
    );
  }, [location.search, searchWithDevice, qrContext, dispatch]);

  const dynamicOffers = buildOffersFromPackages(packageModuleState?.items);
  const offers = dynamicOffers.length > 0 ? dynamicOffers : staticOffers;

  const isLoading = packageModuleState?.status === "loading" || packageModuleState?.status === "idle";

  const checkout = () => {
  if (!selected) return;

  const offer = selected;


  const price =
    offer.priceLabel ||
    String(offer.price || "") ||
    offer.name.match(
      /AED\s*[\d.]+|\d+%|Complimentary/i
    )?.[0] ||
    "";

    const priceNumber = String(price).replace(/[^\d.]/g, "");

    const details = {
      id:
        offer.uidPackageId ||
        offer.uidPackageItemId ||
        offer.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),

      name: offer.name,

      price,

      description: offer.description,

      type: "exclusive-offer",

      moduleId: offer.moduleId || context.moduleId,
    };

    const params = new URLSearchParams({
      companyId: context.companyId,
      branchId: context.branchId,
      sessionId: context.sessionId,
      tableSessionId: context.tableSessionId,

      ...(context.tableId
        ? { tableId: context.tableId }
        : {}),

      ...(context.tableNumber
        ? { tableNumber: context.tableNumber }
        : {}),

      ...(deviceId
        ? { deviceId }
        : {}),

      categoryName: "Exclusive Offers",
      category: "EXCLUSIVE_OFFER",
      reservationCategory: "EXCLUSIVE_OFFER",

      eventName: offer.name,

      offerId: details.id,

      offerName: offer.name,

      offerDescription:
        offer.description || "",

      offerPrice: price,

      bookingType: "Exclusive Offer",

      reservationTitle: offer.name,

      ...(priceNumber
        ? { price: priceNumber }
        : {}),

      moduleId: details.moduleId || "",

      extraDetails: JSON.stringify(details),

      step: "about-you",

      hideSteps: "true",

      hideCardIcon: "true",
    });

    window.location.assign(
      `https://app.thedesirelounge.com/checkout?${params}`
    );
  };

  return (
    <div className="lounge-page offer-page">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="lounge-bg" aria-hidden="true"><div className="lounge-bg__image" style={{ backgroundImage: "url('/assets/images/index-hero-bg.webp')" }} /><div className="lounge-bg__overlay" /></div>
      <div className="lounge-shell bg-games-shell" id="app">
        <header className="lounge-header">
          <a href="/" className="logo lounge-header__logo" aria-label="THE DESIRE LOUNGE home">
            <img src="https://restaurents-api.cylsys.com/Assets/thedesirelounge/Image/Logo/logo.webp" alt="" className="logo__mark" width="48" height="48" />
            <span className="logo__copy"><span className="logo__text">THE DESIRE LOUNGE</span></span>
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
            {isLoading && dynamicOffers.length === 0 ? (
              <p className="bg-loading">Loading offers...</p>
            ) : (
              <>
             <div className="offer-packages">
  {offers.map((offer, index) => {
    const offerKey =
      offer.uidPackageItemId ||
      offer.uidPackageId ||
      offer.name;

    const isExpanded = !!expandedOffers[offerKey];

    const hasChildren =
      Array.isArray(offer.children) &&
      offer.children.length > 0;

    const isSelected =
  selected?.uidPackageItemId === offer.uidPackageItemId;

    return (
     <article
  key={offerKey}
  className={`offer-package${
    offer.featured || offer.isParent
      ? " offer-package--featured"
      : ""
  }${isSelected ? " is-selected" : ""}`}
  onClick={() => {
    if (hasChildren) return;
    setSelected(offer);
  }}
>
        {/* MAIN OFFER CARD */}
        <div className="offer-package__main">
          <h2>
            {offer.name}
            {offer.priceLabel
              ? ` — ${offer.priceLabel}`
              : ""}
          </h2>

          {offer.timing && (
            <p className="offer-package__meta">
              {offer.timing}
            </p>
          )}

          {!offer.timing && offer.meta && (
            <p className="offer-package__meta">
              {offer.meta}
            </p>
          )}

          {offer.description && (
            <p>{offer.description}</p>
          )}

          {/* VIEW MORE */}
          {hasChildren && (
            <button
              type="button"
              className="offer-package__view-more"
              onClick={() =>
                setExpandedOffers((prev) => ({
                  ...prev,
                  [offerKey]: !prev[offerKey],
                }))
              }
            >
              {isExpanded ? "View Less" : "View More"}
            </button>
          )}
        </div>

        {/* CHILD CARDS */}
        {hasChildren && isExpanded && (
          <div className="offer-package__children">
            {offer.children.map((child) => {
              // const childIndex = offers.findIndex(
              //   (item) =>
              //     item.uidPackageItemId ===
              //     child.uidPackageItemId
              // );

              const childSelected =
  selected?.uidPackageItemId === child.uidPackageItemId;

              return (
                <div
                  key={
                    child.uidPackageItemId ||
                    child.uidPackageId ||
                    child.name
                  }
                  className={`offer-package__child-card${
                    childSelected
                      ? " offer-package__child-card--selected"
                      : ""
                  }`}
                  role="button"
                  tabIndex={0}
                onClick={(event) => {
  event.stopPropagation();
  setSelected(child);
}}
               onKeyDown={(event) => {
  if (
    event.key === "Enter" ||
    event.key === " "
  ) {
    event.preventDefault();
    event.stopPropagation();
    // setSelected(childIndex);
  }
}}
                >
                  <div>
                    <h3>{child.name}</h3>

                    {child.timing && (
                      <p className="offer-package__meta">
                        {child.timing}
                      </p>
                    )}

                    {child.description && (
                      <p>{child.description}</p>
                    )}
                  </div>

                  {child.priceLabel && (
                    <strong className="offer-package__child-price">
                      {child.priceLabel}
                    </strong>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* NORMAL OFFER DETAILS */}
        {!hasChildren && (
          <>
            {offer.details &&
              offer.details.length > 0 && (
                <>
                  <h3 className="offer-package__subheading">
                    What's Included
                  </h3>

                  <ul className="offer-sheet__benefits">
                    {offer.details.map(
                      (detail, i) => (
                        <li key={i}>
                          {detail}
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}

            {offer.terms &&
              offer.terms.length > 0 && (
                <>
                  <h3 className="offer-package__subheading">
                    Offer Terms
                  </h3>

                  <ul className="offer-sheet__benefits">
                    {offer.terms.map(
                      (term, i) => (
                        <li key={i}>
                          {term}
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}
          </>
        )}
      </article>
    );
  })}
</div>
             <button
  type="button"
  className="offer-sheet__cta"
  disabled={!selected}
  onClick={checkout}
>
  {!selected
    ? "Select an offer first"
    : `Book ${selected.name}`}
</button>
              </>
            )}
            <p className="offer-sheet__brand">The Desire Lounge - Customer Offers &amp; Packages</p>
          </section></article>
        </main>
      </div>
    </div>
  );
}
