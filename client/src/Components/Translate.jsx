import React, { useEffect, useState } from "react";
import axios from "axios";

const Translate = () => {
    const [languages, setLanguages] = useState([]);
    const [originalText, setOriginalText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState('');
    const [targetLanguage, setTargetLanguage]= useState('');
    const [showHistory, setShowHistory] = useState(false);

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

    const translateClick = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        axios({
            method: "post",
            url: "http://localhost:3000/api/translate",
            headers: {'Authorization':`Bearer ${token}`},
            data: {sourceLanguage:sourceLanguage, targetLanguage:targetLanguage, originalText:originalText}
        }).then((response)=>{
            setTranslatedText(response.data[0].translations[0].text);
        }).catch((err)=>{console.log(err)})
    };

    const handleHistory = () => {
        setShowHistory(!showHistory);
    }

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
                            <select value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)}>
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
                            <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
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
            </div>
        </div>
    )
}

export default Translate;