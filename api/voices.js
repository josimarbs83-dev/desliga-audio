module.exports = async function handler(req, res) {
  try {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) return res.status(500).json({ error: "ELEVENLABS_API_KEY não configurada." });

    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": key }
    });
    const text = await response.text();
    res.status(response.status);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.send(text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
