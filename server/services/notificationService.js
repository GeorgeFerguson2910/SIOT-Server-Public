async function sendTelegramMessage(text) {
  // ⬇️ Read from process.env *when the function runs*, not at import time
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("[notify] Telegram not configured, skipping notification");
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const body = {
    chat_id: TELEGRAM_CHAT_ID,
    text,
    parse_mode: "Markdown",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("[notify] Telegram send failed:", res.status, txt);
    }
  } catch (err) {
    console.error("[notify] Telegram error:", err);
  }
}


export async function notifyNewFaults(newlyActiveFaults, context = {}) {
  if (!newlyActiveFaults.length) return;

  const { device_id, ts } = context;

  rsconsole.log("[faults] New active faults:", {
    device_id: device_id || "unknown",
    ts: ts ? new Date(ts).toISOString() : null,
    faults: newlyActiveFaults,
  });

  const title = "⚠️ Plant fault detected";
  const lines = [];

  lines.push(`Device: ${device_id || "unknown"}`);
  if (ts) {
    lines.push(`Time: ${new Date(ts).toISOString()}`);
  }

  lines.push("");
  lines.push("New active faults:");

  for (const f of newlyActiveFaults) {
    lines.push(`• *${f}*`);
  }

  const text = `${title}\n\n${lines.join("\n")}`;

  await sendTelegramMessage(text);
}
