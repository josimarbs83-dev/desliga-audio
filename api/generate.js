module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Método não permitido." });

    const key = process.env.ELEVENLABS_API_KEY;
    if (!key)
      return res
        .status(500)
        .json({ error: "ELEVENLABS_API_KEY não configurada." });

    const { text, voiceId } = req.body || {};
    if (!text || !voiceId)
      return res.status(400).json({ error: "Texto e voz são obrigatórios." });

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(
        voiceId
      )}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": key,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.78,
            style: 0.2,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const detail = await response.text();
      return res.status(response.status).json({
        error: "Erro ao gerar áudio.",
        detail,
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", buffer.length);
    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).json({
      error: "Erro interno.",
      detail: error.message,
    });
  }
};
