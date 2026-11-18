import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectDeviceId, selectQrContext } from "../store/slices/qrContextSlice";
import { getActiveQrData, isQrEntry, normalizePath } from "../utils/appHelpers";

function CallWaiterFab() {
  const location = useLocation();
  const qrContext = useSelector(selectQrContext);
  const deviceId = useSelector(selectDeviceId);
  const params = new URLSearchParams(location.search);
  const qrData = getActiveQrData(location.search, qrContext);
  const companyId = qrData.companyId || params.get("companyId") || params.get("cid");
  const branchId = qrData.branchId || params.get("branchId") || params.get("bid");

  params.delete("cid");
  params.delete("bid");
  if (companyId) params.set("companyId", companyId);
  if (branchId) params.set("branchId", branchId);
  if (deviceId) params.set("deviceId", deviceId);

  if (
    !isQrEntry(location.search) ||
    ["/call-waiter", "/screen-recording"].includes(normalizePath(location.pathname))
  ) {
    return null;
  }

  const query = params.toString();
  return (
    <a
      className="call-waiter-fab"
      href={`/call-waiter${query ? `?${query}` : ""}`}
      aria-label="Call waiter for assistance"
    >
      <span className="call-waiter-fab__icon" aria-hidden="true">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      </span>
      <span>
        <strong>Call Waiter</strong>
        <small>Need assistance?</small>
      </span>
    </a>
  );
}

export default CallWaiterFab;
