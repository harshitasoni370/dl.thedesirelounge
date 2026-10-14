/**
 * Restaurant ke WhatsApp number par ek pre-filled deep link open karta hai.
 *
 * NOTE: Repo/Postman collection me koi dedicated "send WhatsApp message"
 * backend API nahi hai (sirf checkDevice/reservation APIs hain), isliye ye
 * `wa.me` deep link approach use karta hai — jo already `URLS.contact` me
 * define hai. Reservation confirm hote hi ye ek naya tab kholta hai jisme
 * WhatsApp chat pre-filled message ke saath open ho jaati hai. Agar future
 * me koi dedicated WhatsApp-send API mile to is function ke andar hi
 * replace kiya ja sakta hai — baaki app is function ko as-is call karta
 * rahega.
 */
export function notifyWhatsApp(message, phoneNumber) {
  try {
    const phone = String(phoneNumber || "").replace(/\D/g, "");
    if (!phone) return;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  } catch {
    // Popup blocked ya window unavailable — silently ignore, is se
    // reservation flow fail nahi hona chahiye.
  }
}

export function buildReservationWhatsAppMessage({
  reservationTitle,
  guestName,
  mobile,
  countryCode,
  reservationDateTime,
  table,
  guestCount,
}) {
  const lines = [
    `New Reservation — ${reservationTitle || "Reservation"}`,
    `Guest: ${guestName || "Guest"}`,
    `Mobile: ${countryCode || ""} ${mobile || ""}`.trim(),
    reservationDateTime ? `When: ${reservationDateTime}` : null,
    table ? `Table: ${table}` : null,
    guestCount ? `Guests: ${guestCount}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}
