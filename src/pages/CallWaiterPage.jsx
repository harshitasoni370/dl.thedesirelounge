import { useEffect, useState } from "react";
import { fetchWaiterTypes } from "../utils/waiterApi";

function readErrorMessage(error, fallback) {
  return typeof error?.message === "string" && error.message.trim()
    ? error.message
    : fallback;
}

export default function CallWaiterPage({
  siteName,
  logoUrl,
  companyId,
  branchId,
  homeHref = "/",
  onContinue,
}) {
  const [types, setTypes] = useState([]);
  const [typesStatus, setTypesStatus] = useState("loading");
  const [typesError, setTypesError] = useState("");
  const [typesRetry, setTypesRetry] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [note, setNote] = useState("");
  const [submitError, setSubmitError] = useState("");
  const venueName = siteName || "DESIRE";
  const isOtherSelected = types.some(
    (type) => selectedIds.includes(type.id) && type.name.trim().toLowerCase() === "other",
  );

  useEffect(() => {
    if (!companyId || !branchId) {
      setTypesStatus("failed");
      setTypesError("Venue details are missing. Please reopen this page from your table QR code.");
      return undefined;
    }

    const controller = new AbortController();
    setTypesStatus("loading");
    setTypesError("");

    fetchWaiterTypes({ companyId, branchId, signal: controller.signal })
      .then((items) => {
        setTypes(items);
        setTypesStatus("succeeded");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setTypesError(readErrorMessage(error, "Unable to load request types. Please try again."));
        setTypesStatus("failed");
      });

    return () => controller.abort();
  }, [companyId, branchId, typesRetry]);

  const toggleRequestType = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
    setSubmitError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedReasons = types
      .filter((type) => selectedIds.includes(type.id))
      .map((type) => type.name);
    if (!selectedReasons.length) {
      setSubmitError("Please select at least one reason.");
      return;
    }
    if (isOtherSelected && !note.trim()) {
      setSubmitError("Please provide additional information for Other.");
      return;
    }

    const reservationTitle = "Call Waiter";
    const reservationDetails = {
      id: "call-waiter",
      name: "Call Waiter",
      type: "call-waiter",
      categoryName: "Call Waiter",
      category: "CALL_WAITER",
      bookingType: "Call Waiter",
      reasons: selectedReasons,
      note: note.trim(),
      selectedItem: {
        id: "call-waiter-reason",
        name: selectedReasons.join(", "),
      },
    };
    const specialRequest = [
      "Call waiter requested.",
      `Reason(s): ${selectedReasons.join(", ")}.`,
      note.trim() ? `Additional note: ${note.trim()}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    onContinue({ specialRequest, reservationTitle, reservationDetails });
  };

  return (
    <div className="lounge-page offer-page call-waiter-page">
      <a className="skip-link" href="#main">Skip to content</a>

      <div className="lounge-bg" aria-hidden="true">
        <div
          className="lounge-bg__image"
          style={{ backgroundImage: "url('/assets/images/index-hero-bg.webp')" }}
        />
        <div className="lounge-bg__overlay" />
      </div>

      <div className="lounge-shell bg-games-shell call-waiter-shell">
        <header className="lounge-header">
          <a className="logo lounge-header__logo" href={homeHref} aria-label={`${venueName} home`}>
            {logoUrl && <img className="logo__mark" src={logoUrl} alt="" width="48" height="48" />}
            <span className="logo__copy">
              <span className="logo__text">{venueName}</span>
              <span className="logo__tag">SHEESHA LOUNGE</span>
            </span>
          </a>
          <a className="bg-games-back" href={homeHref} aria-label="Back to Digital Lounge">
            <span aria-hidden="true">‹</span>
            <span>Lounge</span>
          </a>
        </header>

        <main id="main" className="lounge-main bg-games-main call-waiter-main">
          <section className="lounge-hero call-waiter-hero" aria-labelledby="waiter-heading">
            <p className="lounge-hero__welcome">Assistance</p>
            <h1 id="waiter-heading" className="lounge-hero__title">Call Waiter</h1>
            <p className="lounge-hero__copy">
              Select why you need us and enter your request. Our team will be with you shortly.
            </p>
          </section>

          <section className="lounge-panel call-waiter-panel" aria-labelledby="reasons-heading">
            <div className="lounge-panel__head">
              <span className="lounge-panel__rule" aria-hidden="true" />
              <h2 id="reasons-heading">How Can We Help?</h2>
              <span className="lounge-panel__rule" aria-hidden="true" />
            </div>

            <form className="call-waiter-form" onSubmit={handleSubmit}>
              <fieldset className="call-waiter-reasons">
                <legend className="call-waiter-reasons__label">Select one or more reasons *</legend>
                {typesStatus === "loading" && (
                  <p className="call-waiter-note" role="status">Loading request types…</p>
                )}
                {typesStatus === "failed" && (
                  <div className="call-waiter-error call-waiter-message call-waiter-message--error" role="alert">
                    <span>{typesError}</span>
                    <button
                      type="button"
                      className="call-waiter-retry"
                      onClick={() => setTypesRetry((attempt) => attempt + 1)}
                    >
                      Try again
                    </button>
                  </div>
                )}
                {typesStatus === "succeeded" && types.length === 0 && (
                  <p className="call-waiter-error call-waiter-message call-waiter-message--error" role="alert">
                    No waiter request types are available right now.
                  </p>
                )}
                {typesStatus === "succeeded" && types.map((type) => (
                  <label className="call-waiter-option" key={type.id}>
                    <input
                      type="checkbox"
                      name="requestTypeIds"
                      value={type.id}
                      checked={selectedIds.includes(type.id)}
                      onChange={() => toggleRequestType(type.id)}
                    />
                    <span className="call-waiter-option__box" aria-hidden="true" />
                    <span className="call-waiter-option__text">
                      <strong>{type.name}</strong>
                      {type.description && <small>{type.description}</small>}
                    </span>
                  </label>
                ))}
              </fieldset>

              <label className="call-waiter-field" htmlFor="waiter-note">
                <span>Additional note <em>({isOtherSelected ? "required for Other" : "optional"})</em></span>
                <textarea
                  id="waiter-note"
                  name="note"
                  rows="3"
                  maxLength="200"
                  placeholder="Anything else we should know?"
                  required={isOtherSelected}
                  value={note}
                  onChange={(event) => {
                    setNote(event.target.value);
                    setSubmitError("");
                  }}
                />
              </label>

              {submitError && (
                <p className="call-waiter-error call-waiter-message call-waiter-message--error" role="alert">
                  {submitError}
                </p>
              )}

              <button
                className="call-waiter-submit"
                type="submit"
                disabled={typesStatus !== "succeeded" || types.length === 0}
              >
                <span className="call-waiter-submit__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 9a6 6 0 0 0 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" />
                    <path d="M10 21a2 2 0 0 0 4 0" />
                  </svg>
                </span>
                Continue to reservation
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
