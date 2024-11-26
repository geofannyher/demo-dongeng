import { useEffect, useRef, useState } from "react";
import { model, starName, keyword, videoIdle, videoTalk } from "../data";
import { MicIcon, GraphicEqIcon } from "../data/icons";
import { textToSpeech } from "../services/elevenlabs";
import AlertSnackbar from "../components/AlertSnackbar/Alertsnackbar";
import VideoRecorder from "../components/VideoRecorder/VideoRecorder";
import { chatbot, resetChatbot } from "../services/ApiService";
import { generateRandomString } from "../generateString";
import LeftContent from "../components/ContentPart/LeftContent";
import RightContent from "../components/ContentPart/RightContent";
import BottomContent from "../components/ContentPart/BottomContent";
import Header from "../components/Header/Header";
import Button from "../components/Button/Button";
// import { Client } from "@gradio/client";
const Star = () => {
  const [startStory, setStartStory] = useState(false);
  const [newestMessageId, setNewestMessageId] = useState<null | number>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [results, setResults] = useState<any>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const BackgroundAudio = useRef<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  let idUser = useRef("");

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition() as any;
      // Stop after each phrase
      recognitionInstance.continuous = false;
      // Get final results only
      recognitionInstance.interimResults = false;
      // set lang
      recognitionInstance.lang = "id-ID";

      recognitionInstance.onresult = async (event: any) => {
        console.log("hai");
        setIsTyping(true);
        const lastTranscript = event.results[0][0].transcript;
        addMessage(lastTranscript, "user", "User");
        const chatResponse = await chatbot(
          idUser.current,
          lastTranscript,
          starName,
          model
        );

        if (!chatResponse) {
          console.log("gaada hasil");
          return;
        }
        const cleanResult = chatResponse.data
          ? chatResponse.data.replace(/```json\n\[\]\n```/g, "")
          : chatResponse.data;

        const resultChat = cleanResult.includes(keyword)
          ? cleanResult.replace(keyword, "")
          : cleanResult;

        if (!import.meta.env.VITE_PASSWORD) {
          console.log("no data env");
          return;
        }
        // const client = await Client.connect("https://talk.hadiwijaya.co/", {
        //   auth: ["demo", import.meta.env.VITE_PASSWORD],
        // });
        // const { data } = await client.predict("/tts", {
        //   text: resultChat,
        //   model_name: "aluna",
        // });

        const audioResponse: any = await textToSpeech({
          uid: "cmOAElxzaS4tbxmzTzCD",
          similarity_boost: 1,
          stability: 0.38,
          model_id: "eleven_multilingual_v2",
          text: resultChat,
        });

        if (!chatResponse) {
          console.log("gaada audio");
          return;
        }
        setIsTyping(false);
        setShowVideo(true);

        addMessage(resultChat, "star", starName);

        // if (data instanceof Array) {
        //   const url: any = data.map((item) => item.url);
        //   setAudioUrl(url);
        // } else {
        //   console.error("Invalid audio data format:", data);
        // }

        if (audioResponse) {
          const blob = new Blob([audioResponse.data], { type: "audio/mpeg" });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          stopListening();
        } else {
          console.error("Format data audio tidak valid:", audioResponse.data);
        }
      };
      // Triggered when speech ends but no result is received
      recognitionInstance.onspeechend = () => {
        console.log(
          "Pengguna berhenti berbicara tanpa hasil, melanjutkan mendengarkan."
        );
        startListening();
      };

      setRecognition(recognitionInstance);
    } else {
      alert("Browser tidak mendukung Web Speech API");
    }
  }, [isListening]);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    } else {
      console.error("Recognition instance is null, cannot start listening");
    }
  };

  const stopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    } else {
      console.error("Recognition instance is null, cannot stop listening");
    }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current
        .play()
        .catch((error) => console.error("Audio playback error:", error));
      audioRef.current.onended = () => {
        setShowVideo(false);
        startListening();
      };
    }
  }, [audioUrl]);

  useEffect(() => {
    const id = generateRandomString();
    idUser.current = id;
  }, []);

  const addMessage = (text: string, status: string, title: string) => {
    let cleanText = text;
    if (text.includes(keyword)) {
      cleanText = text.replace("##creepy##", "");

      // play background music
      if (!BackgroundAudio.current) {
        setStartStory(true);
        BackgroundAudio.current = new Audio(
          "https://res.cloudinary.com/dcd1jeldi/video/upload/v1730121772/demo-dongeng-bg-music.mp3"
        );
        BackgroundAudio.current.volume = 0.2;
        BackgroundAudio.current.loop = true;
      }
      BackgroundAudio.current.play();
    }

    const newMessage = { status, title, result: cleanText, id: Date.now() };
    setResults((prevResults: any) => [newMessage, ...prevResults]);
    setNewestMessageId(newMessage.id);
  };

  const handleReset = async () => {
    await resetChatbot(idUser.current, starName);
    setResults([]);
    setOpenSnackbar(!openSnackbar);
    setSnackbarMessage("success reset");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
  };

  return (
    <div
      className={`${
        startStory
          ? "bg-black"
          : "bg-gradient-to-r from-orange-700 to-orange-400"
      } flex flex-col items-center min-h-screen transition-all duration-500 ease-in-out`}
    >
      <div className="flex flex-row w-full max-w-screen-xl">
        {/* Left Panel - Chat History */}
        <LeftContent />

        {/* Main Interaction */}
        <div className="flex flex-col rounded-br-[40px] rounded-bl-[40px] items-center w-1/2 relative  gradient-background">
          {/* Audio Recording */}
          <div className="absolute z-30 gap-2 rounded-[40px] bottom-0 w-full flex justify-center items-center bg-white p-2">
            <input
              type="text"
              disabled
              placeholder="Type your message..."
              className="px-4 cursor-not-allowed py-2 rounded-full w-full"
            />
            {isListening ? (
              <Button handleClick={stopListening}>
                <span style={{ pointerEvents: "none" }}>
                  <GraphicEqIcon />
                </span>
              </Button>
            ) : (
              <Button handleClick={startListening}>
                <span style={{ pointerEvents: "none" }}>
                  <MicIcon />
                </span>
              </Button>
            )}
          </div>

          <Header />
          <div className="relative ">
            {showVideo ? (
              <VideoRecorder looping videoSrc={videoTalk} />
            ) : (
              <VideoRecorder looping videoSrc={videoIdle} />
            )}
            {audioUrl && <audio ref={audioRef} src={audioUrl} />}
          </div>
        </div>

        {/* Right Panel - Chat Section */}
        <RightContent
          handleReset={handleReset}
          isTyping={isTyping}
          newestMessageId={newestMessageId}
          results={results}
        />
      </div>

      {/* Bottom Panel - Topic Section */}
      <BottomContent startStory={startStory} />

      {/* alert  */}
      <AlertSnackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
};

export default Star;
