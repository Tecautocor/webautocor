export function trackConversion(kind, label) {
  if (typeof window === "undefined") return;

  try {
    window.gtag?.("event", "generate_lead", {
      lead_type: kind,
      content_name: label,
    });

    window.fbq?.("track", kind === "whatsapp" ? "Contact" : "Lead", {
      content_name: label,
    });

    window.ttq?.track(kind === "whatsapp" ? "Contact" : "SubmitForm", {
      content_name: label,
    });
  } catch (e) {
    // no bloquear la conversión real del usuario si algún pixel falla
  }
}
