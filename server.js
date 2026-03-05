const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { VertexAI } = require("@google-cloud/vertexai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Inizializza Vertex AI
const vertex_ai = new VertexAI({
  project: "focuseducation",
  location: "us-central1",
});

// Seleziona modello
const model = vertex_ai.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// Endpoint generazione quiz / mappe
app.post("/generate-quiz", async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const response = result.response;
    const text = response.candidates[0].content.parts[0].text;

    res.json({ result: text });

  } catch (error) {
    console.error("Errore:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server avviato su http://localhost:3000");
});