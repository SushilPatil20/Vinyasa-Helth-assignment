// import axios from "axios";
// import { AssemblyAI } from "assemblyai";
// import React, { useState } from "react";

// function App() {
//   const [transcribe, setTranscribe] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const client = new AssemblyAI({
//     apiKey: "01303cc5b30449c0bbd6664a6e880a17",
//   });

//   const audioUrl =
//     "https://ia800309.us.archive.org/7/items/30_american_poems_bt_librivox/30americanpoems_01_various.mp3";

//   const config = {
//     audio_url: audioUrl,
//   };

//   const run = async () => {
//     setIsLoading(true);
//     const transcribe = await client.transcripts.transcribe(config);
//     setTranscribe(transcribe.text);
//     setIsLoading(false);
//   };

//   return (
//     <div className="App">
//       <h1 className="text-center text-4xl text-blue-500 my-6">
//         Audio Transcription App
//       </h1>
//       <div className="w-10/12 text-justify mx-auto">
//         <button
//           onClick={run}
//           className="bg-blue-700 text-white px-4 py-2 rounded my-2"
//         >
//           Transcribe
//         </button>
//         <p className="text-justify">{isLoading ? "Loading..." : transcribe}</p>
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "react-google-login";

const CLIENT_ID =
  "910758475450-kg3b1d601sd5cf6hsbe10toad2iei7g2.apps.googleusercontent.com"; // Replace with your Google Client ID
const ASSEMBLYAI_API_KEY = "YOUR_ASSEMBLYAI_API_KEY"; // Replace with your AssemblyAI API Key

const App = () => {
  const [transcription, setTranscription] = useState("");
  const [audioFile, setAudioFile] = useState(null); // To store the recorded audio file

  // Function to upload audio to AssemblyAI
  const uploadAudio = async (audioFile) => {
    const formData = new FormData();
    formData.append("file", audioFile);

    try {
      const response = await axios.post(
        "https://api.assemblyai.com/v2/upload",
        formData,
        {
          headers: {
            Authorization: ASSEMBLYAI_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.upload_url; // Returns the URL of the uploaded audio file
    } catch (error) {
      console.error("Error uploading audio:", error);
      return null;
    }
  };

  // Function to transcribe audio
  const transcribeAudio = async (audioUrl) => {
    try {
      const response = await axios.post(
        "https://api.assemblyai.com/v2/transcript",
        {
          audio_url: audioUrl,
        },
        {
          headers: {
            Authorization: ASSEMBLYAI_API_KEY,
          },
        }
      );
      return response.data.id; // Returns the transcription ID
    } catch (error) {
      console.error("Error starting transcription:", error);
      return null;
    }
  };

  // Function to check transcription status
  const checkTranscriptionStatus = async (transcriptionId) => {
    try {
      const response = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptionId}`,
        {
          headers: {
            Authorization: ASSEMBLYAI_API_KEY,
          },
        }
      );
      return response.data; // Returns the transcription status and text
    } catch (error) {
      console.error("Error checking transcription status:", error);
      return null;
    }
  };

  // Function to handle audio recording completion
  const handleRecordingComplete = async () => {
    if (!audioFile) {
      console.error("No audio file to transcribe.");
      return;
    }

    // Step 1: Upload audio file
    const audioUrl = await uploadAudio(audioFile);

    if (audioUrl) {
      // Step 2: Transcribe audio
      const transcriptionId = await transcribeAudio(audioUrl);

      // Step 3: Poll for transcription result
      const interval = setInterval(async () => {
        const statusResponse = await checkTranscriptionStatus(transcriptionId);

        if (statusResponse && statusResponse.status === "completed") {
          clearInterval(interval);
          setTranscription(statusResponse.text); // Set the transcribed text
        } else if (statusResponse && statusResponse.status === "failed") {
          clearInterval(interval);
          console.error("Transcription failed:", statusResponse.error);
        }
      }, 5000); // Poll every 5 seconds
    }
  };

  // Mock function to simulate recording audio (replace with actual implementation)
  const startRecording = () => {
    // Replace this with actual recording logic
    console.log("Recording started...");
    setTimeout(() => {
      console.log("Recording stopped...");
      // Simulate setting an audio file after recording
      const mockAudioBlob = new Blob(); // Replace with actual recorded audio Blob
      setAudioFile(mockAudioBlob);
    }, 5000); // Simulate a 5-second recording
  };

  return (
    <div>
      <h1>Meeting Transcription</h1>
      <GoogleLogin
        clientId={CLIENT_ID}
        buttonText="Login with Google"
        onSuccess={(response) => console.log("Login Success:", response)}
        onFailure={(response) => console.error("Login Failed:", response)}
        cookiePolicy={"single_host_origin"}
      />
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={handleRecordingComplete}>Complete Recording</button>
      <h2>Transcription:</h2>
      <p>{transcription}</p>
    </div>
  );
};

export default App;
