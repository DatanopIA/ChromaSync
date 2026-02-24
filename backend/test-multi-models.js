const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log(`[${modelName}] Success:`, response.text());
        return true;
    } catch (error) {
        console.error(`[${modelName}] Failed:`, error.message);
        return false;
    }
}

async function main() {
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-2.0-flash-exp"];
    for (const m of models) {
        if (await testModel(m)) break;
    }
}

main();
