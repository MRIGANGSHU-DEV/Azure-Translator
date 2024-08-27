import React, { useEffect, useState } from "react";
import axios from "axios";

const Translate = () => {
    const [languages, setLanguages] = useState([]);
    const [originalText, setOriginalText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLanguageShort, setSourceLanguageShort] = useState('');
    const [targetLanguageShort, setTargetLanguageShort]= useState('');
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(()=>{
        const fetchLanguages = () => {
            const token = localStorage.getItem('token');
            axios({
                method: 'GET',
                url: "http://localhost:3000/api/languages",
                headers: {'Authorization':`Bearer ${token}`}
            }).then((response)=>{
                setLanguages(response.data.translation)
            }).catch((err)=>{console.log(err)})
        };
        fetchLanguages();
    }, []);

    const fetchHistory = () => {
        const token = localStorage.getItem('token');
        axios({
            method: 'GET',
            url: "http://localhost:3000/api/translation-history",
            headers: {'Authorization':`Bearer ${token}`}
        }).then((response)=>{
            setHistory(response.data);
        }).catch((err)=>{console.log('Error fetching translation history:', err)});
    };

    const translateClick = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const sourceLanguageFull=languages[sourceLanguageShort].name;
        const targetLanguageFull=languages[targetLanguageShort].name;
        
        axios({
            method: "POST",
            url: "http://localhost:3000/api/translate",
            headers: {'Authorization':`Bearer ${token}`},
            data: {sourceLanguageShort:sourceLanguageShort, targetLanguageShort:targetLanguageShort, originalText:originalText, sourceLanguageFull:sourceLanguageFull, targetLanguageFull:targetLanguageFull}
        }).then((response)=>{
            setTranslatedText(response.data[0].translations[0].text);
            
            //Updating history after translation immediately
            fetchHistory();

        }).catch((err)=>{console.log(err)})
    };

    const handleHistory = () => {
        if (!showHistory) {
            fetchHistory();
        }
        setShowHistory(!showHistory);
    };
    

    return (
        <div className={`translator-container ${showHistory ? 'show-history' : ''}`}>
            <div className="translation-block"> 
                <div className="translator-header">
                    <h1>Azure Translator</h1>
                </div>
                <div className="translator-row-one">
                    <div className="from-container">
                        <div className="lang-box">
                            <label>Select Source Language:</label>
                            <select value={sourceLanguageShort} onChange={(e) => setSourceLanguageShort(e.target.value)}>
                                {Object.keys(languages).map((lang) => (<option key={lang} value={lang}>{languages[lang].name}</option>))}
                            </select>
                        </div>
                        <div>
                            <textarea value={originalText} onChange={(e) => setOriginalText(e.target.value)} placeholder="Enter Text to Translate" />
                        </div>
                    </div>
                    <div className="to-container">
                        <div>
                            <label>Select Target Language:</label>
                            <select value={targetLanguageShort} onChange={(e) => setTargetLanguageShort(e.target.value)}>
                                {Object.keys(languages).map((lang) => (<option key={lang} value={lang}>{languages[lang].name}</option>))}
                            </select>
                        </div>
                        <div>
                            <textarea value={translatedText} readOnly />
                        </div>
                    </div>
                </div>
                <div className="translator-row-two">
                    <button onClick={translateClick}>Translate</button>
                    <button onClick={handleHistory}>{showHistory ? "Hide History" : "Show History"}</button>
                </div>
            </div>
            <div className="history-block">
                <h1>History</h1>
                {history.length > 0 ? (
                    <ul>
                        {history.slice().reverse().map((item, index) => ( // Reverse the history array
                            <li key={index}>
                                <p><strong>Original Text:</strong> {item.originalText}</p>
                                <p><strong>Translated Text:</strong> {item.translatedText}</p>
                                <p><strong>Source Language:</strong> {item.sourceLanguage}</p>
                                <p><strong>Target Language:</strong> {item.targetLanguage}</p>
                                <br/>
                                <hr/>
                                <br/>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No translation history found.</p>
                )}
            </div>
        </div>
    )
}

export default Translate;