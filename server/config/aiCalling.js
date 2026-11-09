const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
async function openRouterCalling() {
  const { OpenRouter } = await import("@openrouter/sdk");
  const client = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  return client;
}
module.exports = openRouterCalling;
