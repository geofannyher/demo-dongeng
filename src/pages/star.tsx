import { useEffect, useRef, useState } from "react";
import MicIcon from "@mui/icons-material/Mic";
import AddIcon from "@mui/icons-material/Add";
import VideocamIcon from "@mui/icons-material/Videocam";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import CakeIcon from "@mui/icons-material/Cake";
import Face6Icon from "@mui/icons-material/Face6";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PaidIcon from "@mui/icons-material/Paid";
import AlertSnackbar from "../components/AlertSnackbar/Alertsnackbar";
import VideoRecorder from "../components/VideoRecorder/VideoRecorder";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { chatbot, resetChatbot } from "../services/ApiService";
import TypewriterEffect from "../components/TypewriterEffect/TypewriterEffect";
import { cardData } from "../data";
import TypingIndicator from "../components/TypeIndicator";
import { textToSpeech } from "../services/elevenlabs";

const Star = () => {
  const [startStory, setStartStory] = useState(false);
  const [newestMessageId, setNewestMessageId] = useState<null | number>(null);

  const [showVideo, setShowVideo] = useState(false);
  // const [voiceId] = useState("cmOAElxzaS4tbxmzTzCD");
  const [model] = useState("gpt-4o");
  const [starName] = useState("naya_dongeng");
  const [results, setResults] = useState<any>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const BackgroundAudio = useRef<HTMLAudioElement | null>(null);

  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  let idUser = useRef("");
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition() as any;
      recognitionInstance.continuous = false; // Stop after each phrase
      recognitionInstance.interimResults = false; // Get final results only
      recognitionInstance.lang = "id-ID"; // Set language

      recognitionInstance.onresult = async (event: any) => {
        setIsTyping(true);
        const lastTranscript = event.results[0][0].transcript;
        await addMessage(lastTranscript, "user", "User");
        stopListening();
        const chatResponse = await makeApiCall(
          () => chatbot(idUser.current, lastTranscript, starName, model),
          "Error during chatbot processing"
        );

        if (!chatResponse) {
          console.log("gaada hasil");
          return;
        }
        const cleanResult = chatResponse.data
          ? chatResponse.data.replace(/```json\n\[\]\n```/g, "")
          : chatResponse.data;

        const resultChat = cleanResult.includes("##creepy##")
          ? cleanResult.replace("##creepy##", "")
          : cleanResult;

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

        await addMessage(resultChat, "star", starName);

        if (audioResponse) {
          const blob = new Blob([audioResponse.data], { type: "audio/mpeg" });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        } else {
          console.error("Invalid audio data format:", audioResponse.data);
        }
      };

      // recognitionInstance.onend = () => {
      //   if (isListening) {
      //     recognitionInstance.start(); // Restart recognition automatically
      //   }
      // };

      setRecognition(recognitionInstance);
    } else {
      alert("Browser tidak mendukung Web Speech API");
    }
  }, [isListening]);

  const generateRandomString = async () => {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    idUser.current = result;
  };

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      console.log("start");
      recognition.start();
    } else {
      console.error("Recognition instance is null, cannot start listening");
    }
  };

  const stopListening = () => {
    if (recognition) {
      setIsListening(false);
      console.log("stop");
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
        startListening();
        // if (isListening) {
        setShowVideo(false);
        // recognition.start();
        // }
      };
    }
  }, [audioUrl]);

  useEffect(() => {
    generateRandomString();
    setNewestMessageId(231313);
  }, []);

  const addMessage = async (text: string, status: string, title: string) => {
    let cleanText = text;
    if (text.includes("##creepy##")) {
      cleanText = text.replace("##creepy##", "");

      // Memainkan audio latar belakang
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

    // Menambahkan pesan baru ke state
    const newMessage = { status, title, result: cleanText, id: Date.now() };
    setResults((prevResults: any) => [newMessage, ...prevResults]);
    setNewestMessageId(newMessage.id);
  };

  const makeApiCall = async (apiFunc: any, errorMessage: string) => {
    try {
      const response = await apiFunc();
      return response;
    } catch (error) {
      console.error(error);
      setSnackbarMessage(errorMessage);
      setOpenSnackbar(true);
      setShowVideo(false);
      return null;
    }
  };

  const handleReset = async () => {
    makeApiCall(
      () => resetChatbot(idUser.current, starName),
      "Error during chatbot reset"
    );
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
        <div className="flex flex-col space-y-5 w-1/4 p-4">
          <div className="text-3xl text-white font-bold">OWDI</div>
          <div className="space-y-2 ">
            <h1 className="text-white text-sm font-semibold">
              Own Digital Companion
            </h1>
            <p className="text-white text-sm font-normal">
              your digital friend who is always ready to help you with your
              daily activities, making life simpler and more fun!
            </p>
          </div>
          <button className="text-white  bg-gradient-to-r flex items-center justify-between px-4 from-orange-600 to-orange-400 font-semibold py-4 rounded-xl border border-orange-600 shadow-lg mb-4">
            Buat Sesi Obrolan Baru <KeyboardArrowRightIcon fontSize="small" />
          </button>

          {/* Riwayat Obrolan */}
          <div className="bg-[#FEE0D9] rounded-xl shadow-lg p-4 w-72">
            <div className="flex items-center justify-between pb-2 border-b border-opacity-50 border-[#FF8B79]">
              <h2 className="font-semibold text-[#333E4F] text-lg">
                Riwayat Obrolan
              </h2>
              <KeyboardArrowDownIcon
                fontSize="small"
                className="text-[#333E4F]"
              />
            </div>
            <ul className="mt-3 text-[#333E4F]">
              <span className="text-xs text-[#A8A8A8]">31 Oktober 2024</span>
              <li className="flex py-4  justify-between items-center text-sm">
                <span className="font-semibold">
                  Owdi Ceritakan film Angkasa
                </span>
                <KeyboardArrowRightIcon
                  fontSize="small"
                  className="text-[#333E4F]"
                />
              </li>
              <li className="flex py-4  justify-between items-center text-sm">
                <span className="font-semibold">
                  Owdi Ceritakan film Sehati Se...
                </span>
                <KeyboardArrowRightIcon
                  fontSize="small"
                  className="text-[#333E4F]"
                />
              </li>
              <span className="text-xs text-[#A8A8A8]">28 Oktober 2024</span>
              <li className="flex py-4  justify-between items-center text-sm">
                <span className="font-semibold">Owdi aku sedih</span>
                <KeyboardArrowRightIcon
                  fontSize="small"
                  className="text-[#333E4F]"
                />
              </li>
              <li className="flex py-4  justify-between items-center text-sm">
                <span className="font-semibold">
                  Horor kampung setan di Banyuw...
                </span>
                <KeyboardArrowRightIcon
                  fontSize="small"
                  className="text-[#333E4F]"
                />
              </li>
            </ul>
          </div>
        </div>

        {/* Center Panel - Main Interaction */}
        <div className="flex flex-col rounded-br-[40px] rounded-bl-[40px] items-center w-1/2 relative  gradient-background">
          {/* Audio Recording */}
          <div className="absolute z-30 gap-2 rounded-[40px] bottom-0 w-full flex justify-center items-center bg-white p-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="px-4 py-2 rounded-full w-full"
            />
            {isListening ? (
              <button
                onClick={() => stopListening()}
                onContextMenu={(e) => e.preventDefault()}
                className="text-white shadow-xl bg-gradient-to-r flex items-center justify-between px-6 from-orange-600 to-orange-400 font-semibold py-2 rounded-full border border-orange-600"
              >
                <span style={{ pointerEvents: "none" }}>
                  <GraphicEqIcon />
                </span>
              </button>
            ) : (
              <button
                onClick={() => startListening()}
                onContextMenu={(e) => e.preventDefault()}
                className="text-white shadow-xl bg-gradient-to-r flex items-center justify-between px-6 from-orange-600 to-orange-400 font-semibold py-2 rounded-full border border-orange-600"
              >
                <span style={{ pointerEvents: "none" }}>
                  <MicIcon />
                </span>
              </button>
            )}
          </div>
          <div className="flex justify-center w-full py-4">
            <button className="background-color-btn flex gap-2 items-center justify-center font-semibold text-white px-4 py-2 rounded-full">
              <PaidIcon className="text-yellow-600" fontSize="small" /> 50
              credits tersisa <AddIcon />
            </button>
          </div>
          <div className="relative ">
            {showVideo ? (
              <VideoRecorder
                looping
                videoSrc="https://res.cloudinary.com/dcd1jeldi/video/upload/v1731581284/m3qr5uj61gfg5jqskgxw.mp4"
              />
            ) : (
              <VideoRecorder
                looping
                videoSrc="https://res.cloudinary.com/dcd1jeldi/video/upload/v1731389998/dongeng-idle.mp4"
              />
            )}
            {audioUrl && <audio ref={audioRef} src={audioUrl} />}
          </div>
        </div>

        {/* Right Panel - Chat Section */}
        <div className="flex flex-col w-full p-4 custom-gradient-bg">
          <div className="bg-none p-4">
            {isTyping && (
              <div className="w-1/3 gap-3 flex flex-col mb-2 semi-transparent-background px-2 ml-4 pb-2 text-left rounded-br-xl rounded-tr-xl rounded-bl-xl">
                <div>
                  <p className="star-text pl-2">Owdi</p>
                </div>
                <TypingIndicator />
              </div>
            )}
            {results && results.length > 0 && (
              <div className="overflow-y-auto h-[500px] text-white z-20 flex flex-col justify-center items-center">
                <div className="w-full h-full px-4 space-y-3 overflow-y-auto">
                  {results.map((result: any, _: any) => {
                    const cleanResult = result.result.replace(
                      /```json\n\[\]\n```/g,
                      ""
                    );
                    return (
                      <div
                        className={`w-full semi-transparent-background px-4 ${
                          result.status === "user"
                            ? "text-right rounded-br-xl rounded-tl-xl rounded-bl-xl"
                            : "text-left rounded-br-xl rounded-tr-xl rounded-bl-xl"
                        }`}
                        key={result.id} // Add a key for each element
                      >
                        <p
                          className={
                            result.status === "user" ? "user-text" : "star-text"
                          }
                        >
                          {result.title == "naya_dongeng" ? "Owdi" : "You"}
                        </p>
                        <div className="content-text">
                          {result.id === newestMessageId ? (
                            <TypewriterEffect text={cleanResult} />
                          ) : (
                            <span
                              className="text-white"
                              dangerouslySetInnerHTML={{
                                __html: cleanResult,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {results && results.length > 1 && (
              <div className="mt-2 flex w-full">
                <button
                  onClick={() => handleReset()}
                  className="w-full rounded-full cursor-pointer px-4 py-2 border-white text-white fo border-2 "
                >
                  Selesaikan Sesi ini
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Panel - Topic Section */}
      {/* <div className="flex flex-col text-color-primary py-6 bg-gradient-to-t from-orange-500 to-orange-600 w-full"> */}
      <div
        className={`${
          startStory
            ? "bg-gray-900"
            : "bg-gradient-to-t from-orange-500 to-orange-600"
        } flex flex-col text-color-primary py-6 transition-all duration-500 ease-in-out w-full`}
      >
        <div className="mb-2 container mx-auto ml-[26rem]">
          <div className="space-y-2">
            <h1 className="text-left font-semibold text-white">
              Mau Owdi ceritakan topik dibawah ini ?
            </h1>
            {/* Topic Buttons */}
            <div className="flex space-x-2 mb-4">
              <button className="bg-blue-900 text-white font-semibold py-2 px-4 rounded-full focus:outline-none flex gap-2 items-center">
                Semua Topik
              </button>
              <button className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-full focus:outline-none flex gap-2 items-center">
                <VideocamIcon fontSize="small" /> Film
              </button>
              <button className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-full focus:outline-none flex gap-2 items-center">
                <Face6Icon fontSize="small" /> Film Horor
              </button>
              <button className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-full focus:outline-none flex gap-2 items-center">
                <CakeIcon fontSize="small" />
                Resep Makanan
              </button>
              <button className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-full focus:outline-none flex gap-2 items-center">
                <ImportContactsIcon fontSize="small" />
                Cerita Anak
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {cardData.map((item, index) => {
            const IconComponent = item.icons;
            return (
              <div key={index}>
                <div className="bg-white w-64 rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt="Topic Image"
                    className={`w-full h-36  ${
                      item.category === "Horor" ? "object-cover" : "object-fill"
                    }`}
                  />
                  <div className="p-4 relative">
                    <h3 className="font-bold text-xs mb-2">{item.title}</h3>
                    <div className="flex justify-between items-center text-gray-600">
                      <div className=" absolute -top-3 bg-gray-200 bg-opacity-85 font-semibold rounded-xl px-2">
                        <IconComponent className="mr-2" fontSize="small" />
                        <span className="text-sm">{item.category}</span>
                      </div>
                      <span className="text-xs flex items-center gap-1 font-semibold">
                        <PaidIcon
                          fontSize="small"
                          className="text-yellow-600"
                        />{" "}
                        {item.credits} Credit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <AlertSnackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
};

export default Star;
