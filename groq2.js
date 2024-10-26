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

// Array to store conversation history
let conversationHistory = [];

// Function to add messages to history (without importance)
const MAX_HISTORY_LENGTH = 10; // Keep a maximum of 10 messages

function updateConversationHistory(role, content) {
  conversationHistory.push({ role, content });

  // Trim conversation history to a maximum length
  if (conversationHistory.length > MAX_HISTORY_LENGTH) {
    conversationHistory.shift(); // Remove the oldest message
  }
}

// Function to handle the chat completion
async function getGroqChatCompletion() {
  try {
    const response = await groq.chat.completions.create({
      messages: conversationHistory, // Send the trimmed conversation history
      model: "llama3-8b-8192", // Change the model as per your requirement
    });
    const reply = response.choices[0]?.message?.content || "No response";
    console.log("AI:", reply);
    // Add the AI's response to the conversation history
    updateConversationHistory("assistant", reply);
  } catch (error) {
    console.error("Error in chat completion:", error);
  }
}

// Function to prompt user input and chat continuously
function startChat() {
  rl.question("You: ", async (userMessage) => {
    // Add user message to the conversation history
    updateConversationHistory("user", userMessage);
    
    // Call the chat completion function
    await getGroqChatCompletion();

    // Log the conversation history (for debugging purposes)
    console.log(conversationHistory);

    // Restart the chat after getting a response
    startChat();
  });
}

// Start the chat process
startChat();