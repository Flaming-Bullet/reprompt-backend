const fetch = require("node-fetch");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { systemPrompt, userPrompt } = req.body;

  if (!systemPrompt || !userPrompt) {
    return res.status(400).json({ error: "Missing systemPrompt or userPrompt" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    const data = await openaiRes.json();

    if (!data.choices || !data.choices.length) {
      throw new Error("Invalid response from OpenAI");
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("❌ OpenAI error:", err);
    res.status(500).json({ error: "Failed to fetch from OpenAI" });
  }
};
