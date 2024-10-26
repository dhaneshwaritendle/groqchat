const express=require("express");
const getGroqChatCompletion = require("./groq2.js");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Example route to interact with Groq model
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Call the function from groq.js
    const responseMessage = await getGroqChatCompletion(userMessage);
    res.json({ response: responseMessage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get a response from Groq model' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
