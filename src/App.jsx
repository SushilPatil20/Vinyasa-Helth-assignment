import { AssemblyAI } from "assemblyai";
import React, { useState } from "react";
import { pipeline } from "@huggingface/transformers";
import Loader from "./components/loader";
import { getWordFrequency } from "./utils/helpers";
import KeywordProgressGraph from "./components/KeywordsProgressGraph";

function App() {
  const [transcribe, setTranscribe] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [wordsFrequency, setWordsFrequency] = useState([]);
  const apikey = import.meta.env.VITE_API_KEY;

  const client = new AssemblyAI({ apiKey: apikey });

  const audioUrl = "https://assembly.ai/wildfires.mp3"; // -------- URL 1
  //   "https://ia800309.us.archive.org/7/items/30_american_poems_
  //    bt_librivox/30americanpoems_01_various.mp3";    // -------- URL 2
  const config = { audio_url: audioUrl };

  // ---------- summarizeText----------

  const summarizeText = async (transcripts) => {
    setIsSummarizing(true);
    const summarizer = await pipeline("summarization");
    const summaryArray = await summarizer(transcripts);
    const summary = summaryArray[0].summary_text;
    setSummary(summary);
    const wordsFreq = getWordFrequency(summary);
    setWordsFrequency(wordsFreq);
    setIsSummarizing(false);
  };

  // ---------- Transcribing Dummy audio ----------

  const transcribeAudio = async () => {
    setIsLoading(true);
    const transcribe = await client.transcripts.transcribe(config);
    setTranscribe(transcribe.text);
    summarizeText(transcribe.text);
    setIsLoading(false);
  };

  return (
    <div className="App px-6">
      <h1 className="text-center text-4xl text-blue-500 my-6">
        Note taker App
      </h1>
      <div className=" text-justify mx-auto">
        <button
          onClick={transcribeAudio}
          className="bg-blue-700 text-white px-4 py-2 rounded"
        >
          Transcribe
        </button>
        <div className="flex space-x-8">
          <div className="w-1/2">
            <h2 className="text-gray-500 mt-6 text-xl">Transcription</h2>

            {isLoading ? (
              <Loader text="transcribed text" />
            ) : (
              <p className="text-justify text-sm mt-3">{transcribe}</p>
            )}
          </div>
          <div className="w-1/2">
            <h2 className="text-gray-500 mt-6 text-xl">Summary</h2>
            {isSummarizing ? (
              <Loader text="summary" />
            ) : (
              <p className="text-justify text-sm mt-3">{summary}</p>
            )}
            {wordsFrequency.length > 0 && (
              <KeywordProgressGraph keywordData={wordsFrequency} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
