// api/generateBriefing.js

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { prompt } = req.body;
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // change to "gpt-4" if supported
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Error calling OpenAI API", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
