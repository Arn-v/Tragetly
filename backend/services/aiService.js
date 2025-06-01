
const OpenAI = require('openai');
const Groq = require('groq-sdk');


//grok key need to add
const groqKey = process.env.GROQ_API_KEY;
if (!groqKey) {
    throw new Error('GROQ_API_KEY is not set in environment variables');
}

const groq = new Groq( { apiKey:groqKey  , baseURL: "https://api.groq.com/openai/v1"}) ;


async function parseNaturalLangToQuery(prompt)
{
     try{
        const chat = await groq.chat.completions.create(
            {
                model:"llama-3.1-8b-instant" , 
                messages : [  {  role: 'system', content: `You are an assistant that converts user segmentation descriptions into MongoDB query objects. Only return a JSON object compatible with MongoDB's find() query.`},
                              { role: 'user', content: `Convert this to MongoDB query: ${prompt}`}  
                            ]
            }
        )

        const message = chat.data.choices[0].message.content;
        console.log("LLM response:", message);

        const query = JSON.parse(message);
        return query;
     }


     catch(error) { console.error('Groq API error:', error.response?.data || error.message);
     throw new Error('Failed to parse natural language prompt.');
    }

}

module.exports = { parseNaturalLangToQuery } 

