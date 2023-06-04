import React, { useState } from 'react';
import axios from 'axios';
import MonacoEditor from 'react-monaco-editor';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [vulnerabilityExplanation, setVulnerabilityExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysisSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/analyse', { code }).then( async(response)=>{ 
        setAnalysisResult(response.data);
        const explanationResponse = await axios.post('http://localhost:3001/analyse2', { code });
        setVulnerabilityExplanation(explanationResponse.data);
      }
     );
     
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'analyse du code', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="App">
      <nav className="navbar1" style={{marginBottom:"20px"}}>
      <h1>Analyse de sécurité de smart contract</h1>
      </nav>
      <div className="container-fluid">
        <div className="row">
          <div className="col-4">
            <h2>Entrez votre code ici:</h2>
            <MonacoEditor
              width="100%"
              className="code-editor"
              height="70vh"
              language="javascript"
              theme="vs-dark"
              value={code}
              onChange={setCode}
              
            />
            <button onClick={handleAnalysisSubmit} className="btn btn-primary" disabled={isLoading}>
              {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Analyser'}
            </button>
          </div>
          <div className="col-2">
          </div>
          <div className="col-6" style={{height: '90vh', overflow: 'auto'}}>
            {analysisResult && (
              <div className="result-section">
                <h2>Correction proposée :</h2>
                <SyntaxHighlighter language="javascript" style={solarizedlight}>
                  {analysisResult}
                </SyntaxHighlighter>
              </div>
            )}
            {vulnerabilityExplanation && (
              <div className="explanation-section">
                <h2>Explication :</h2>
                <p className="explanation-text">{vulnerabilityExplanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
