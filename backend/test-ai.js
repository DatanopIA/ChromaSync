const { generatePalette } = require('./services/aiService');
const dotenv = require('dotenv');
dotenv.config();

async function test() {
    try {
        console.log("Testing AI generatePalette...");
        const result = await generatePalette("Montaña");
        console.log("Success:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Test failed:", error.message);
    }
}

test();
