const { listModels } = require('./services/aiService');
const dotenv = require('dotenv');
dotenv.config();

async function test() {
    try {
        await listModels();
    } catch (error) {
        console.error("Test failed:", error.message);
    }
}

test();
