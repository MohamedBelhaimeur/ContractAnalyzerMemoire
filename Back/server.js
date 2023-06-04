const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
const app = express();
const cors = require('cors'); 
app.use(
  cors({
    origin: 'http://localhost:3000', // Replace with your allowed domain
    methods: ['GET', 'POST'], // Specify the allowed HTTP methods
  })
);

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);
app.use(express.json());
const message = [

];
app.post('/analyse', async (req, res) => {
  const { code } = req.body;
  
  try {
  

    const result = await openai.createChatCompletion( 
      {
    
      model: "gpt-3.5-turbo",
      
      messages:[
        {"role": "system", "content": "Tu es un expert en sécurité des smart contracts. Répond en proposant en proposant une correction du code fournit"},
        {"role": "user", "content": code},
        {"role": "assistant", "content": "Voici le code corrigé sans commentaire, code: "},
   
        
      
    
    ],
      max_tokens : 1791,
      temperature: 0.7,

      
    });
    message.push({"role": "system", "content": "Tu es un expert en sécurité des smart contracts. Répond en proposant en proposant une correction du code fournit"});
    message.push({"role": "user", "content": code});
    message.push({"role": "assistant", "content": "Voici le code corrigé sans commentaire, code: "});
    message.push({"role": "assistant", "content": result.data.choices[0].message.content});
    res.json(result.data.choices[0].message.content);
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Une erreur est survenue lors de l\'analyse du code' });
  }
});

app.post('/analyse2', async (req, res) => {
  message.push({"role": "assistant", "content": "Voici un rapport textuel montrant les vulnérabilité type de smart contract retrouvé dans le code fournit "})
  try {

    const result = await openai.createChatCompletion( 
      {
    
      model: "gpt-3.5-turbo",
      
     messages:message,
      max_tokens : 1791,
      temperature: 0.7,

      
    });
    res.json(result.data.choices[0].message.content);

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Une erreur est survenue lors de l\'analyse du code' });
  }
});
app.listen(3001, () => console.log('Serveur écoutant sur le port 3001'));
