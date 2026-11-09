// here the client will be cretaed and then in the fucntion we are going to use this
const openRouterCalling = require("../config/aiCalling.js");
console.log("Is my key loading?:", process.env.OPENROUTER_API_KEY);
async function generateSummary() {
  const client = await openRouterCalling();
  const response = await client.responses.send({
    responsesRequest: {
      model: "liquid/lfm-3-1.7b",
      instructions:
        "You are an assistant that creates concise and accurate video summaries.",
      // input: `${transcript}`,
      input: "Who is The best crickter in the world ?",
    },
  });
  const data = await response.json();
  console.log(data);
  // return data;
}
generateSummary();
