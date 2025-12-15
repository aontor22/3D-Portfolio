import { GoogleGenAI, Type } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = "gemini-2.5-flash";

export const generateTriviaQuestion = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Generate a short, fun trivia question about ${topic}. Return ONLY the question text.`,
      config: {
        temperature: 0.9,
      }
    });
    return response.text || "Could not generate question.";
  } catch (error) {
    console.error("Trivia generation error:", error);
    return "Who is known as the father of computing?";
  }
};

export const checkTriviaAnswer = async (question: string, userAnswer: string): Promise<{ correct: boolean; feedback: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `
        Question: ${question}
        User Answer: ${userAnswer}
        
        Evaluate if the user's answer is correct or close enough. 
        Return a JSON object with two properties:
        1. "correct": boolean
        2. "feedback": string (Keep it witty and under 20 words)
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correct: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
          },
          required: ["correct", "feedback"],
        },
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text);
  } catch (error) {
    console.error("Answer check error:", error);
    return { correct: false, feedback: "AI is sleeping. Try again!" };
  }
};

export const getChatResponse = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  try {
    const chat = ai.chats.create({
      model: modelId,
      history: history,
      config: {
        systemInstruction: `You are Neo, an AI assistant for Udoy Chowdhury's portfolio. 
        
        Key Info about Udoy:
        - Education: B.Sc in CSE from Green University of Bangladesh (2022).
        - Skills: React.js, Node.js, Java (Swing), Python, SQL, Selenium Testing, Manual Testing.
        - Projects: 
          1. MediCraft (Medical Store System): Role-based, optimized MongoDB queries by 40%.
          2. Customer Relationship System: Java Swing desktop app, handles 10k+ records.
          3. Food Ordering System: Reduced order placement time by 50%.
        - Academic: ML Image Classification (92% accuracy), NLP Chatbot.
        - Contact: udoychowdhury90413@gmail.com.
        
        Be witty, professional, and highlight his Full-Stack and Testing capabilities.`,
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "Connection to the neural net disrupted.";
  }
};