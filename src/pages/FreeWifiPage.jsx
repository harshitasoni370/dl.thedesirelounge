import { QRCodeSVG } from "qrcode.react";

function getResponseLayers(response) {
  const layers = [];
  let current = response;

  while (current && typeof current === "object" && !layers.includes(current)) {
    layers.push(current);
    current = current.data || current.Data;
  }

  return layers;
}

function readBoolean(value) {
  return value === true || value === 1 || String(value).trim().toLowerCase() === "true";
}

export function isWifiCredentialsRequired(response) {
  return getResponseLayers(response).some((layer) =>
    readBoolean(layer.isRequired ?? layer.IsRequired),
  );
}

function getWifiCredentials(response) {
  const layers = getResponseLayers(response);
  const sources = layers.flatMap((layer) => [
    layer.wifiCredentials,
    layer.WifiCredentials,
    layer.wifi,
    layer.Wifi,
    layer,
  ]).filter((source) => source && typeof source === "object");
  const readCredential = (keys) => {
    for (const source of sources) {
      for (const key of keys) {
        const value = source[key];
        if (typeof value === "string" && value.trim()) return value.trim();
      }
    }
    return "";
  };

  return {
    username: readCredential(["wifiUsername", "wifiUserName", "userName", "username", "WifiUsername", "WifiUserName", "UserName", "Username"]),
    password: readCredential(["wifiPassword", "password", "WifiPassword", "Password"]),
  };
}

export default function FreeWifiPage({
  siteName,
  logoUrl,
  deviceCheck,
  companyId,
  demoMode = "",
  isRegisteredCustomer = false,
}) {
  const isDemoCredentials = demoMode === "credentials";
  const isDemoQrRequested = demoMode === "qr";
  const isDemoQr = isDemoQrRequested && isRegisteredCustomer;
  const isDemoQrLoading =
    isDemoQrRequested &&
    !isRegisteredCustomer &&
    (deviceCheck.status === "idle" || deviceCheck.status === "loading");
  const credentials = isDemoCredentials
    ? { username: "demo-wifi-user", password: "demo-wifi-pass123" }
    : getWifiCredentials(deviceCheck.data);
  const isRequired = isWifiCredentialsRequired(deviceCheck.data);
  const isLoading =
    isDemoQrLoading ||
    (
    !isDemoCredentials &&
    !isDemoQr &&
    !isDemoQrRequested &&
    (deviceCheck.status === "loading" ||
      (deviceCheck.status === "idle" && Boolean(companyId)))
    );
  const hasCredentials = Boolean(credentials.username || credentials.password);
  const demoQrUrl = (() => {
    const qrUrl = new URL(
      import.meta.env.VITE_WIFI_DEMO_QR_BASE_URL || window.location.origin,
    );
    qrUrl.pathname = "/free-wifi";
    const params = new URLSearchParams(window.location.search);
    params.set("wifiDemo", "credentials");
    qrUrl.search = params.toString();
    return qrUrl.toString();
  })();

  return (
    <div className="lounge-page offer-page free-wifi-page">
      <div className="lounge-bg" aria-hidden="true">
        <div
          className="lounge-bg__image"
          style={{ backgroundImage: "url('/assets/images/index-hero-bg.webp')" }}
        />
        <div className="lounge-bg__overlay" />
      </div>

      <div className="lounge-shell bg-games-shell">
        <header className="lounge-header">
          <a className="logo lounge-header__logo" href="/" aria-label={`${siteName || "Digital Lounge"} home`}>
            {logoUrl && <img className="logo__mark" src={logoUrl} alt="" width="48" height="48" />}
            <span className="logo__copy">
              <span className="logo__text">{siteName || "DESIRE"}</span>
              <span className="logo__tag">{siteName ? "DIGITAL LOUNGE" : "SHEESHA LOUNGE"}</span>
            </span>
          </a>
          <a className="bg-games-back" href="/" aria-label="Back to Digital Lounge">
            <span aria-hidden="true">‹</span>
            <span>Lounge</span>
          </a>
        </header>

        <main id="main" className="lounge-main bg-games-main">
          <article className="offer-sheet">
            <section className="offer-sheet__panel free-wifi-panel" aria-labelledby="wifi-title">
              <header className="offer-sheet__banner">
                <span className="lounge-panel__rule" aria-hidden="true" />
                <h1 id="wifi-title">Free Wi-Fi</h1>
                <span className="lounge-panel__rule" aria-hidden="true" />
              </header>

              <p className="offer-sheet__tagline">Stay connected while you relax.</p>

              {isDemoQr ? (
                <div className="free-wifi-demo">
                  <p className="free-wifi-message">
                    Scan this demo QR code to view sample Wi-Fi login details.
                  </p>
                  <div className="free-wifi-demo__qr">
                    <QRCodeSVG
                      value={demoQrUrl}
                      size={220}
                      bgColor="#ffffff"
                      fgColor="#111111"
                      level="M"
                      includeMargin
                      title="Demo Wi-Fi credentials QR code"
                    />
                  </div>
                  <p className="free-wifi-demo__url">{demoQrUrl}</p>
                  <a className="offer-sheet__cta" href={demoQrUrl}>
                    Open demo credentials
                  </a>
                  {/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(demoQrUrl) && (
                    <p className="free-wifi-demo__hint">
                      To scan from another device, set <code>VITE_WIFI_DEMO_QR_BASE_URL</code> to
                      this app’s LAN or public URL in <code>.env</code>, then restart Vite with
                      <code> --host 0.0.0.0</code>.
                    </p>
                  )}
                </div>
              ) : isDemoCredentials ? (
                <>
                  <p className="free-wifi-message">
                    Demo credentials shown after scanning the QR code. These are sample details only.
                  </p>
                  <dl className="free-wifi-credentials">
                    <div className="free-wifi-credential">
                      <dt>Username</dt>
                      <dd>{credentials.username}</dd>
                    </div>
                    <div className="free-wifi-credential">
                      <dt>Password</dt>
                      <dd>{credentials.password}</dd>
                    </div>
                  </dl>
                </>
              ) : isLoading ? (
                <p className="free-wifi-message" role="status">Loading your Wi-Fi details…</p>
              ) : isDemoQrRequested && !isRegisteredCustomer ? (
                <p className="free-wifi-message" role="alert">
                  {deviceCheck.status === "failed"
                    ? "We couldn’t verify your registration. Please try again or ask our team."
                    : "Please register first to access the demo Wi-Fi QR code."}
                </p>
              ) : deviceCheck.status === "idle" ? (
                <p className="free-wifi-message" role="alert">
                  We couldn’t identify this venue. Please return to the lounge page and try again.
                </p>
              ) : deviceCheck.status === "failed" ? (
                <p className="free-wifi-message" role="alert">
                  We couldn’t verify your Wi-Fi access right now. Please try again or ask our team.
                </p>
              ) : !isRequired ? (
                <p className="free-wifi-message" role="status">
                  Wi-Fi details are not available for this device. Please ask our team for help.
                </p>
              ) : hasCredentials ? (
                <>
                  <p className="free-wifi-message">
                    Use these details to connect to the guest Wi-Fi network.
                  </p>
                  <dl className="free-wifi-credentials">
                    {credentials.username && (
                      <div className="free-wifi-credential">
                        <dt>Username</dt>
                        <dd>{credentials.username}</dd>
                      </div>
                    )}
                    {credentials.password && (
                      <div className="free-wifi-credential">
                        <dt>Password</dt>
                        <dd>{credentials.password}</dd>
                      </div>
                    )}
                  </dl>
                </>
              ) : (
                <p className="free-wifi-message" role="alert">
                  Wi-Fi credentials could not be loaded. Please ask our team for help.
                </p>
              )}

              <a className="offer-sheet__cta" href="/">
                Back to Digital Lounge
              </a>
              <p className="offer-sheet__brand">{siteName || "Digital Lounge"} · Guest Wi-Fi</p>
            </section>
          </article>
        </main>
      </div>
    </div>
  );
}
