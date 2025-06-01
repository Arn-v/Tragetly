
const OpenAI = require('openai');
const Groq = require('groq-sdk');


//grok key need to add
const groqKey = process.env.GROQ_API_KEY;
if (!groqKey) {
    throw new Error('GROQ_API_KEY is not set in environment variables');
}

const groq = new Groq( { apiKey:groqKey  , baseURL: "https://api.groq.com/openai/v1"}) ;

//system prompt for LLM to give it context
const systemPrompt = `
You are an assistant that converts user segmentation descriptions into MongoDB find() queries.

Here’s the customer data schema:
- name: String
- email: String
- phone: String
- gender: Enum ('male', 'female', 'other')
- totalSpend: Number
- visits: Number
- lastActive: Date
- orderCount: Number
- createdAt: Date

Your task:
- Generate a strict JSON object representing the MongoDB query for the customer collection.
- Use MongoDB’s comparison operators ($gt, $lt, $eq, $gte, $lte, $in, $ne) as needed.
- Match fields and data types exactly from the schema.
- The JSON should be directly usable in Mongoose’s Customer.find({ ... }) query.
- Do not include explanations, markdown, or any extra text — only output the JSON object.

Examples:
- If the prompt says: "Customers who spent more than 5000 and have visited more than 3 times", generate:
  {
    "totalSpend": { "$gt": 5000 },
    "visits": { "$gt": 3 }
  }`


async function parseNaturalLangToQuery( prompt )
{
     try{
        const chat = await groq.chat.completions.create(
            {
                model:"llama-3.1-8b-instant" , 
                messages : [  {  role: 'system', content: systemPrompt },
                              { role: 'user', content: `Convert this to MongoDB query: ${prompt}`}  
                            ]
            }
        )

        const message = chat.data.choices[0].message.content ;
        console.log("LLM response:", message);

        const query = JSON.parse(message);
        return query;
     }


     catch(error) { console.error('Groq API error:', error.response?.data || error.message);
     throw new Error('Failed to parse natural language prompt.');
    }

}

module.exports = { parseNaturalLangToQuery } 

