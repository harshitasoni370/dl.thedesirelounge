import { useEffect, useState } from "react";
import { createWaiterRequest, fetchTables, fetchWaiterTypes } from "../utils/waiterApi";

function readMessage(payload, fallback) {
  const message = payload?.message || payload?.Message;
  return typeof message === "string" && message.trim() ? message : fallback;
}

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
  tableId,
  tableNumber,
  homeHref = "/",
}) {
  const [types, setTypes] = useState([]);
  const [typesStatus, setTypesStatus] = useState("loading");
  const [typesError, setTypesError] = useState("");
  const [typesRetry, setTypesRetry] = useState(0);
  const [tables, setTables] = useState([]);
  const [tablesStatus, setTablesStatus] = useState("loading");
  const [tablesError, setTablesError] = useState("");
  const [tablesRetry, setTablesRetry] = useState(0);
  const [selectedTableId, setSelectedTableId] = useState(tableId || "");
  const [selectedIds, setSelectedIds] = useState([]);
  const [note, setNote] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const venueName = siteName || "DESIRE";

  useEffect(() => {
    if (!branchId) {
      setTables([]);
      setTablesStatus("failed");
      setTablesError("Branch details are missing. Please reopen this page from your table QR code.");
      return undefined;
    }

    const controller = new AbortController();
    setTablesStatus("loading");
    setTablesError("");

    fetchTables({ branchId, signal: controller.signal })
      .then((items) => {
        setTables(items);
        setTablesStatus("succeeded");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setTablesError(readErrorMessage(error, "Unable to load tables. Please try again."));
        setTablesStatus("failed");
      });

    return () => controller.abort();
  }, [branchId, tablesRetry]);

  useEffect(() => {
    if (!tables.length) return;
    const normalize = (value) => String(value).toLowerCase().replace(/[^a-z0-9]/g, "").replace(/^table/, "");
    const selected =
      tables.find((table) => table.id === selectedTableId) ||
      tables.find((table) =>
        [table.name, table.code].some((value) => value && normalize(value) === normalize(tableNumber || selectedTableId)),
      );
    if (selected && selected.id !== selectedTableId) setSelectedTableId(selected.id);
  }, [selectedTableId, tableNumber, tables]);

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
    setSuccessMessage("");
  };

  const clearFeedback = () => {
    setSubmitError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedTableId) {
      setSubmitError("Please select your table number.");
      return;
    }
    if (!selectedIds.length) {
      setSubmitError("Please select at least one reason.");
      return;
    }
    if (!companyId || !branchId) {
      setSubmitError("Venue details are missing. Please reopen this page from your table QR code.");
      return;
    }

    setSubmitStatus("loading");
    setSubmitError("");
    setSuccessMessage("");

    try {
      const response = await createWaiterRequest({
        companyId,
        branchId,
        tableId: selectedTableId,
        requestTypeIds: selectedIds,
        note: note.trim(),
      });
      setSuccessMessage(readMessage(response, "Your request has been sent. Our team will be with you shortly."));
      setSubmitStatus("succeeded");
    } catch (error) {
      setSubmitError(readErrorMessage(error, "Unable to send your request. Please try again."));
      setSubmitStatus("failed");
    }
  };

  return (
    <div className="lounge-page offer-page call-waiter-page">
      <div className="lounge-bg" aria-hidden="true">
        <div
          className="lounge-bg__image"
          style={{ backgroundImage: "url('/assets/images/index-hero-bg.webp')" }}
        />
        <div className="lounge-bg__overlay" />
      </div>

      <div className="lounge-shell bg-games-shell">
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

        <main id="main" className="lounge-main bg-games-main">
          <header className="call-waiter-intro">
            <p className="offer-sheet__tagline">Assistance</p>
            <h1>Call Waiter</h1>
            <p>Select why you need us and your table number. Our team will be with you shortly.</p>
          </header>

          <article className="offer-sheet">
            <form className="offer-sheet__panel call-waiter-form" onSubmit={handleSubmit}>
              <div className="call-waiter-form__divider">
                <span className="lounge-panel__rule" aria-hidden="true" />
                <h2>How can we help?</h2>
                <span className="lounge-panel__rule" aria-hidden="true" />
              </div>

              <label className="call-waiter-label" htmlFor="waiter-table-number">
                Table number
                <select
                  id="waiter-table-number"
                  name="tableId"
                  value={selectedTableId}
                  disabled={tablesStatus === "loading"}
                  onChange={(event) => {
                    setSelectedTableId(event.target.value);
                    clearFeedback();
                  }}
                  required
                >
                  <option value="">
                    {tablesStatus === "loading" ? "Loading tables…" : "Select your table"}
                  </option>
                  {selectedTableId && !tables.some((table) => table.id === selectedTableId) && (
                    <option value={selectedTableId}>{tableNumber || "Current table"}</option>
                  )}
                  {tables.map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.name}{table.code ? ` (${table.code})` : ""}
                    </option>
                  ))}
                </select>
              </label>
              {tablesStatus === "failed" && (
                <div className="call-waiter-message call-waiter-message--error" role="alert">
                  <span>{tablesError}</span>
                  <button
                    type="button"
                    className="call-waiter-retry"
                    onClick={() => setTablesRetry((attempt) => attempt + 1)}
                  >
                    Try again
                  </button>
                </div>
              )}
              {tablesStatus === "succeeded" && tables.length === 0 && (
                <p className="call-waiter-message call-waiter-message--error" role="alert">
                  No tables are available for this branch.
                </p>
              )}

              <fieldset className="call-waiter-reasons">
                <legend className="call-waiter-label">Select one or more reasons *</legend>
                {typesStatus === "loading" && (
                  <p className="free-wifi-message" role="status">Loading request types…</p>
                )}
                {typesStatus === "failed" && (
                  <div className="call-waiter-message call-waiter-message--error" role="alert">
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
                  <p className="call-waiter-message call-waiter-message--error" role="alert">
                    No waiter request types are available right now.
                  </p>
                )}
                {typesStatus === "succeeded" && types.map((type) => (
                  <label className="call-waiter-reason" key={type.id}>
                    <input
                      type="checkbox"
                      name="requestTypeIds"
                      value={type.id}
                      checked={selectedIds.includes(type.id)}
                      onChange={() => toggleRequestType(type.id)}
                    />
                    <span className="call-waiter-reason__copy">
                      <strong>{type.name}</strong>
                      {type.description && <small>{type.description}</small>}
                    </span>
                  </label>
                ))}
              </fieldset>

              <label className="call-waiter-label" htmlFor="waiter-note">
                Additional note <span>(optional)</span>
                <textarea
                  id="waiter-note"
                  name="note"
                  rows="4"
                  placeholder="Anything else we should know?"
                  value={note}
                  onChange={(event) => {
                    setNote(event.target.value);
                    setSubmitError("");
                    setSuccessMessage("");
                  }}
                />
              </label>

              {submitError && (
                <p className="call-waiter-message call-waiter-message--error" role="alert">
                  {submitError}
                </p>
              )}
              {successMessage && (
                <p className="call-waiter-message call-waiter-message--success" role="status">
                  {successMessage}
                </p>
              )}

              <button
                className="offer-sheet__cta call-waiter-submit"
                type="submit"
                disabled={
                  submitStatus === "loading" ||
                  tablesStatus !== "succeeded" ||
                  !selectedTableId ||
                  typesStatus !== "succeeded" ||
                  !types.length
                }
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                  <path d="M10 21h4" />
                </svg>
                {submitStatus === "loading" ? "Sending request…" : "Call waiter"}
              </button>
            </form>
          </article>
        </main>
      </div>
    </div>
  );
}
