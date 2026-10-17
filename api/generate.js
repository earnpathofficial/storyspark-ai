/**
 * StorySpark AI — safe generation endpoint scaffold.
 *
 * This endpoint intentionally does NOT call a video provider yet.
 * No provider API key is required, no paid requests are made, and no prompt
 * is forwarded to a third party. Connect a provider only after its free-tier
 * terms and hard spending controls have been verified.
 */
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST for movie generation." });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const style = typeof body.style === "string" ? body.style : "";
  const duration = Number(body.durationSeconds || 0);

  if (!prompt) {
    return res.status(400).json({ error: "Enter a prompt first." });
  }
  if (prompt.length > 4000) {
    return res.status(400).json({ error: "Prompt must be 4,000 characters or fewer." });
  }
  if (!["cartoon", "realistic", "mixed"].includes(style)) {
    return res.status(400).json({ error: "Choose cartoon, realistic, or mixed style." });
  }
  if (!Number.isFinite(duration) || duration < 1 || duration > 600) {
    return res.status(400).json({ error: "Duration must be between 1 and 600 seconds." });
  }

  // Deliberately fail closed until a provider is explicitly configured.
  // Never return a fake job ID or claim that a movie was generated.
  return res.status(503).json({
    code: "VIDEO_PROVIDER_NOT_CONFIGURED",
    generated: false,
    charged: false,
    message: "StorySpark AI is in free setup mode. No movie was generated, and no provider was contacted or charged."
  });
};
