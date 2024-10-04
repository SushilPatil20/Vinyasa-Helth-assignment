import axios from "axios";
import React, { useState } from "react";

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState("");

  // Handle file input change
  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  // Function to handle transcription
  const handleTranscribe = async () => {
    // if (!audioFile) {
    //   alert("Please upload an audio file.");
    //   return;
    // }

    const formData = new FormData();
    formData.append("file", audioFile);

    // Fireflies API endpoint for transcription
    const url = "https://api.fireflies.ai/graphql";
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer 2f895d51-f794-4c01-84b5-6200f0d0ba92", // Replace with your Fireflies API key
    };

    const input = {
      url: "Recording.m4a",
      title: "title of the file",
      attendees: [
        {
          displayName: "Fireflies Notetaker",
          email: "notetaker@fireflies.ai",
          phoneNumber: "xxxxxxxxxxxxxxxx",
        },
        {
          displayName: "Fireflies Notetaker 2",
          email: "notetaker2@fireflies.ai",
          phoneNumber: "xxxxxxxxxxxxxxxx",
        },
      ],
    };

    const data = {
      query: `       mutation($input: AudioUploadInput) {
              uploadAudio(input: $input) {
                success
                title
                message
              }
            }
          `,
      variables: { input },
    };

    try {
      const response = await axios.post(url, data, { headers });
      console.log(response);
      //   const transcribedText = response.data.data.uploadAudio.transcription;

      //   setTranscription(transcribedText);
    } catch (error) {
      console.error("Error during transcription:", error);
      alert("An error occurred during transcription. Please try again.");
    }
  };

  return (
    <div className="App">
      <h1>Audio Transcription App</h1>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleTranscribe}>Transcribe</button>

      {transcription && (
        <div>
          <h2>Transcription Result:</h2>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
}

export default App;
