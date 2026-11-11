import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCardModule, selectCardModule } from "../store/slices/cardModuleSlice";
import { fetchPackageModuleItems, selectPackageModule } from "../store/slices/packageSlice";
import { getImageUrl } from "../utils/imageUrl";

function flattenPackages(items) {
  return items.flatMap((item) => [
    item,
    ...(item.children || []).map((child) => ({ ...child, parentName: item.name })),
  ]);
}

function ModuleCard({ card, onBook }) {
  const metadata = [card.categoryName, card.priceLabel, ...(card.features || [])]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index);
  const status = String(card.status || "").toUpperCase();
  const available = status === "AVAILABLE" || status === "ACTIVE";
  const statusClass = available ? "available" : status === "IN_USE" ? "busy" : "busy";
  const statusLabel = available ? "Available" : status === "IN_USE" ? "In Use" : "Unavailable";

  return (
    <article className="module-detail-page__card bg-card">
      <div className="bg-card__media">
        {card.imageUrl ? (
          <img src={getImageUrl(card.imageUrl)} alt="" loading="lazy" />
        ) : (
          <span aria-hidden="true">{card.name.slice(0, 1).toUpperCase()}</span>
        )}
      </div>
      <div className="bg-card__body">
        <h2 className="bg-card__title">{card.name}</h2>
        {card.subtitle && <p className="bg-card__desc">{card.subtitle}</p>}
        {card.description && <p className="bg-card__desc">{card.description}</p>}
        <ul className="module-detail-page__meta">
          {metadata.map((value, index) => (
            <li key={`${card.uidCardId}-meta-${index}`}>{value}</li>
          ))}
        </ul>
        <div className="bg-card__availability-row">
          <div className={`bg-card__status bg-card__status--${statusClass}`}>
            <span className="bg-card__status-dot" aria-hidden="true" />
            <span>{statusLabel}</span>
          </div>
          {available && (
            <div className="bg-card__actions bg-card__actions--single">
              <button
                type="button"
                className="bg-card__btn bg-card__btn--solid bg-card__btn--status"
                onClick={() => onBook(card, "card")}
              >
                Reserve Session
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function ModulePackage({ item, selected, onSelect }) {
  return (
    <article
      className={`offer-package module-detail-page__package${selected ? " is-selected" : ""}`}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`Select ${item.name}`}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      {item.parentName && (
        <p className="offer-package__meta">Part of — {item.parentName}</p>
      )}
      <h2>{item.name}</h2>
      {(item.timing || item.subtitle) && (
        <p className="offer-package__meta">{item.timing || item.subtitle}</p>
      )}
      {(item.priceLabel || (item.price !== null && item.price !== undefined)) && (
        <p className="module-detail-page__price">
          {item.priceLabel || `AED ${item.price}`}
        </p>
      )}
      {item.description && <p>{item.description}</p>}
      {item.inclusions?.length > 0 && (
        <ul className="module-detail-page__list">
          {item.inclusions.map((inclusion, index) => (
            <li key={`${item.uidPackageId}-${index}`}>{inclusion}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function DynamicModulePage({
  contentType,
  moduleId,
  moduleName,
  moduleSubtitle,
  search,
  qrContext,
  siteName,
  logoUrl,
  registrationHref,
  onBook,
}) {
  const dispatch = useDispatch();
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const cardModuleState = useSelector(selectCardModule);
  const packageModuleState = useSelector(selectPackageModule);
  const cardModuleId = cardModuleState.moduleId;
  const cardStatus = cardModuleState.status;
  const packageModuleId = packageModuleState.moduleId;
  const packageStatus = packageModuleState.status;
  const homeParams = new URLSearchParams(search || "");
  ["moduleId", "packageModuleId", "moduleType", "moduleName", "moduleSubtitle"].forEach((key) =>
    homeParams.delete(key),
  );
  const homeQuery = homeParams.toString();
  const homeHref = `/${homeQuery ? `?${homeQuery}` : ""}`;

  useEffect(() => {
    if (
      contentType !== "card" ||
      !moduleId ||
      (cardModuleId === moduleId && cardStatus !== "idle")
    ) {
      return;
    }
    dispatch(fetchCardModule({ search, qrContext, overrides: { moduleId } }));
  }, [cardModuleId, cardStatus, contentType, dispatch, moduleId, qrContext, search]);

  useEffect(() => {
    if (
      contentType !== "package" ||
      !moduleId ||
      (packageModuleId === moduleId && packageStatus !== "idle")
    ) {
      return;
    }
    dispatch(fetchPackageModuleItems({ search, qrContext, overrides: { moduleId } }));
  }, [contentType, dispatch, moduleId, packageModuleId, packageStatus, qrContext, search]);

  const status =
    contentType === "card"
      ? cardModuleId === moduleId
        ? cardModuleState.status
        : "loading"
      : contentType === "package"
        ? packageModuleId === moduleId
          ? packageModuleState.status
          : "loading"
        : "succeeded";
  const error =
    contentType === "card" ? cardModuleState.error : packageModuleState.error;
  const cards = cardModuleState.items || [];
  const packages = flattenPackages(packageModuleState.items || []);
  const selectedPackage = packages.find(
    (item, index) => `${item.uidPackageId}-${index}` === selectedPackageId,
  );

  useEffect(() => {
    setSelectedPackageId("");
  }, [moduleId]);

  const retry = () => {
    if (contentType === "card") {
      dispatch(fetchCardModule({ search, qrContext, overrides: { moduleId } }));
    } else if (contentType === "package") {
      dispatch(fetchPackageModuleItems({ search, qrContext, overrides: { moduleId } }));
    }
  };

  return (
    <div className="lounge-page module-detail-page">
      <div className="lounge-bg" aria-hidden="true">
        <div
          className="lounge-bg__image"
          style={{ backgroundImage: "url('/assets/images/index-hero-bg.webp')" }}
        />
        <div className="lounge-bg__overlay" />
      </div>
      <div className="lounge-shell bg-games-shell">
        <header className="lounge-header">
          <Link to={homeHref} className="logo lounge-header__logo" aria-label="Back to lounge">
            {logoUrl && (
              <img src={logoUrl} alt="" className="logo__mark" width="48" height="48" />
            )}
            <span className="logo__copy">
              <span className="logo__text">{siteName || "DESIRE"}</span>
            </span>
          </Link>
          <Link to={homeHref} className="bg-games-back">
            <span>Lounge</span>
          </Link>
        </header>
        <main id="main" className="lounge-main bg-games-main">
          <section className="offer-sheet__panel module-detail-page__panel">
            <header className="offer-sheet__banner">
              <span className="lounge-panel__rule" />
              <h1>{moduleName || "Lounge Module"}</h1>
              <span className="lounge-panel__rule" />
            </header>
            {moduleSubtitle && <p className="module-detail-page__subtitle">{moduleSubtitle}</p>}
            {registrationHref && (
              <a className="offer-sheet__cta module-detail-page__register" href={registrationHref}>
                Register for {moduleName || "Loyalty Program"}
              </a>
            )}
            {!moduleId && contentType !== "detail" ? (
              <p className="bg-loading" role="alert">
                This module link is missing its module ID.
              </p>
            ) : status === "loading" || status === "idle" ? (
              <p className="bg-loading" role="status">
                Loading {contentType === "package" ? "packages" : "cards"}...
              </p>
            ) : status === "failed" ? (
              <div className="module-detail-page__message" role="alert">
                <p>Unable to load this module right now.</p>
                {error && <p>{error}</p>}
                <button type="button" onClick={retry}>Try again</button>
              </div>
            ) : contentType === "card" ? (
              cards.length ? (
                <div className="module-detail-page__grid">
                  {cards.map((card) => (
                    <ModuleCard key={card.uidCardId} card={card} onBook={onBook} />
                  ))}
                </div>
              ) : (
                <p className="bg-loading">No cards are available right now.</p>
              )
            ) : contentType === "package" ? (
              packages.length ? (
                <>
                  <div className="offer-packages module-detail-page__packages">
                    {packages.map((item, index) => {
                      const key = `${item.uidPackageId}-${index}`;
                      return (
                        <ModulePackage
                          key={key}
                          item={item}
                          selected={selectedPackageId === key}
                          onSelect={() => setSelectedPackageId(key)}
                        />
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    className="offer-sheet__cta module-detail-page__book"
                    disabled={!selectedPackage}
                    onClick={() => selectedPackage && onBook(selectedPackage, "package")}
                  >
                    {selectedPackage ? `Book ${selectedPackage.name}` : "Select a package first"}
                  </button>
                </>
              ) : (
                <p className="bg-loading">No packages are available right now.</p>
              )
            ) : (
              <p className="module-detail-page__subtitle">
                {moduleSubtitle || "This module is available at the lounge."}
              </p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
