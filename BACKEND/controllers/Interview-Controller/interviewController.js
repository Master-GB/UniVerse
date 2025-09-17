const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askAI = async (req, res) => {
  // console.log("askAI function called"); // <-- Add this
  // console.log("API Key exists:", !!process.env.GEMINI_API_KEY); // <-- Add this to check the key
  try {
    const { userAnswer, chatHistory } = req.body;

    // Pick a model (Gemini 1.5 for conversations is common)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a mock interviewer. Continue this interview.
Chat so far: ${chatHistory.map((h) => `${h.type}: ${h.message}`).join("\n")}
Candidate's last answer: ${userAnswer}
Respond with the next interview question or feedback.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ reply: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
};

module.exports = { askAI };
