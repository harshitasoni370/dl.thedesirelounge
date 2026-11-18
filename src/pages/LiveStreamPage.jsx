function getSafeUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";

  try {
    const url = new URL(value.trim());
    const localHttp =
      url.protocol === "http:" &&
      typeof window !== "undefined" &&
      ["localhost", "127.0.0.1"].includes(window.location.hostname);
    if (url.protocol !== "https:" && !localHttp) return "";
    return url.toString();
  } catch {
    return "";
  }
}

function getYouTubeEmbedUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] || "";
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") || "";
      } else {
        videoId = url.pathname.match(/^\/(?:embed|live|shorts)\/([^/]+)/)?.[1] || "";
      }
    } else if (host === "youtube-nocookie.com") {
      videoId = url.pathname.match(/^\/embed\/([^/]+)/)?.[1] || "";
    }

    if (!/^[\w-]{11}$/.test(videoId)) return "";
    const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
    embedUrl.searchParams.set("autoplay", "1");
    embedUrl.searchParams.set("mute", "1");
    embedUrl.searchParams.set("playsinline", "1");
    return embedUrl.toString();
  } catch {
    return "";
  }
}

function resolveStream(streamConfig) {
  if (!streamConfig || typeof streamConfig !== "object" || Array.isArray(streamConfig)) {
    return { status: "offline" };
  }
  const isDisabled = (value) =>
    value === false || value === 0 || String(value).trim().toLowerCase() === "false";
  if (
    isDisabled(streamConfig.isLive) ||
    isDisabled(streamConfig.enabled) ||
    isDisabled(streamConfig.isActive)
  ) {
    return { status: "offline" };
  }

  const rawUrl =
    streamConfig.url ||
    streamConfig.streamUrl ||
    streamConfig.embedUrl ||
    streamConfig.videoUrl;
  const url = getSafeUrl(rawUrl);
  if (!url) {
    if (rawUrl) return { status: "invalid" };
    return { status: "offline" };
  }

  const type = String(
    streamConfig.type || streamConfig.provider || streamConfig.sourceType || streamConfig.videoType || "",
  ).toLowerCase();
  if (["youtube", "youtube-live", "youtube_live"].includes(type)) {
    const embedUrl = getYouTubeEmbedUrl(url);
    return embedUrl
      ? { status: "live", type: "embed", url: embedUrl }
      : { status: "invalid" };
  }
  if (["video", "mp4", "hls", "file"].includes(type)) {
    return { status: "live", type: "video", url };
  }
  if (["embed", "iframe", "other"].includes(type)) {
    return { status: "live", type: "embed", url };
  }

  const youtubeUrl = getYouTubeEmbedUrl(url);
  if (youtubeUrl) return { status: "live", type: "embed", url: youtubeUrl };
  if (/\.(?:mp4|webm|ogv|m3u8)(?:$|[?#])/i.test(url)) {
    return { status: "live", type: "video", url };
  }
  return { status: "live", type: "embed", url };
}

function LivePlaceholder({ invalid = false }) {
  return (
    <div className="live-stream-placeholder" role={invalid ? "alert" : "status"}>
      <span className="live-stream-placeholder__icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="5" y="8" width="38" height="29" rx="4" />
          <path d="M17 43h14M24 37v6M19 19l11 6-11 6V19Z" />
        </svg>
      </span>
      <strong>{invalid ? "Live stream unavailable" : "No live stream right now"}</strong>
      <span>
        {invalid
          ? "The live video could not be loaded. Please try again later."
          : "Please check back soon for the next live broadcast."}
      </span>
    </div>
  );
}

export default function LiveStreamPage({
  siteName,
  logoUrl,
  homeHref = "/",
  streamConfig,
}) {
  const venueName = siteName || "DESIRE";
  const stream = resolveStream(streamConfig);

  return (
    <div className="lounge-page offer-page live-stream-page">
      <div className="lounge-bg" aria-hidden="true">
        <div
          className="lounge-bg__image"
          style={{ backgroundImage: "url('/assets/images/index-hero-bg.webp')" }}
        />
        <div className="lounge-bg__overlay" />
      </div>

      <div className="lounge-shell bg-games-shell live-stream-shell">
        <header className="lounge-header">
          <a className="logo lounge-header__logo" href={homeHref} aria-label={`${venueName} home`}>
            {logoUrl && <img className="logo__mark" src={logoUrl} alt="" width="48" height="48" />}
            <span className="logo__copy">
              <span className="logo__text">{venueName}</span>
              <span className="logo__tag">DIGITAL LOUNGE</span>
            </span>
          </a>
          <a className="bg-games-back" href={homeHref} aria-label="Back to Digital Lounge">
            <span aria-hidden="true">‹</span>
            <span>Lounge</span>
          </a>
        </header>

        <main className="lounge-main bg-games-main live-stream-main">
          <section className="live-stream-heading" aria-labelledby="live-stream-title">
            <p>Watch with us</p>
            <h1 id="live-stream-title">Live at {venueName}</h1>
          </section>

          <section className="live-stream-player" aria-label="Live video">
            {stream.status === "live" ? (
              <>
                <span className="live-stream-badge">
                  <span aria-hidden="true" />
                  LIVE
                </span>
                {stream.type === "video" ? (
                  <video
                    className="live-stream-media"
                    src={stream.url}
                    controls
                    autoPlay
                    muted
                    playsInline
                    aria-label="Live video"
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                      event.currentTarget.nextElementSibling.hidden = false;
                    }}
                  />
                ) : (
                  <iframe
                    className="live-stream-media"
                    src={stream.url}
                    title="Live video"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                      event.currentTarget.nextElementSibling.hidden = false;
                    }}
                  />
                )}
                <div className="live-stream-error" hidden role="alert">
                  <LivePlaceholder invalid />
                </div>
              </>
            ) : (
              <LivePlaceholder invalid={stream.status === "invalid"} />
            )}
          </section>

          <p className="live-stream-footnote">
            Live video is provided by {venueName}.
          </p>
        </main>
      </div>
    </div>
  );
}
