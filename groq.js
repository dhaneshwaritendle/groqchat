const dotenv = require("dotenv");
const Groq = require("groq-sdk");
const readline = require("readline");

// Load environment variables
dotenv.config();

// Initialize Groq with the API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Set up readline for continuous user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to handle the chat completion
async function getGroqChatCompletion(userMessage) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      model: "llama3-8b-8192", // Change the model as per your requirement
    });
    const reply = response.choices[0]?.message?.content || "No response";
    console.log("AI:", reply);
  } catch (error) {
    console.error("Error in chat completion:", error);
  }
}

// Function to prompt user input and chat continuously
function startChat() {
  rl.question("You: ", async (userMessage) => {
    await getGroqChatCompletion(userMessage);
    startChat(); // Restart the chat after getting a response
  });
}

// Start the chat process
startChat();
