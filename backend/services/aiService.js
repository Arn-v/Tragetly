
const OpenAI = require('openai');
const Groq = require('groq-sdk');


//grok key need to add
const groqKey = process.env.GROQ_API_KEY;
if (!groqKey) {
    throw new Error('GROQ_API_KEY is not set in environment variables');
}

const groq = new Groq( { apiKey:groqKey }) ;

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


async function parseNaturalLanguageToQuery( prompt )
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

        console.log("Full Groq API Response:", chat);

        if (!chat.choices || chat.choices.length === 0) {
                throw new Error('Groq API did not return any choices.');
        }

        const message = chat.choices[0].message.content ;
        console.log("LLM response:", message);

        const query = JSON.parse(message);
        console.log(query) ; 
        return query;
     }


     catch(error) { console.error('Groq API error:', error.response?.data || error.message);
     throw new Error('Failed to parse natural language prompt.');
    }

}










const systemPrompt2 = `
You are a marketing copywriter working for a CRM system.

You will be given MongoDB segment rules in JSON format. These rules describe the characteristics of a target customer segment.

Your task is to generate a short, catchy, and persuasive marketing message to engage that audience. Use the placeholder {{name}} for personalization. The message should be suitable for an SMS or email campaign.

The message should:
- Be warm, friendly, and motivating .
- Highlight the customer’s potential benefits
- Avoid mentioning the raw rules directly (e.g., don’t say “totalSpend” or “$gt”)
- Feel human, not robotic , no more than 1-2 sentences

You must only return the final marketing message without any extra explanation, markdown, or formatting.

Example:
If given this segment:
{
  "totalSpend": { "$gt": 5000 },
  "visits": { "$gt": 3 }
}

You might return:
"Hi {{name}}, as one of our top spenders and frequent visitors, enjoy a special 20% discount just for you!"

Here’s the segment rules you need to craft a message for:`


// Function to generate a marketing message suggestion based 
async function generateMessageSuggestion( segmentRules )
{

   const rulesString = JSON.stringify(segmentRules, null, 2);


  const chat = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: 'system', content:  systemPrompt2 },
      { role: 'user', content: rulesString }
    ]
  });

  const suggestion = chat.choices[0].message.content.trim();
  return suggestion;
};


module.exports = { parseNaturalLanguageToQuery , generateMessageSuggestion }; 

