import axios from "axios";

export const speechToText = async (base64Audio: any) => {
  const response = await axios.post(
    import.meta.env.VITE_APP_API_TTS_STT + "stt",
    {
      model: "whisper-1",
      file_base64: base64Audio,
      temperature: 1,
      language: "id",
    }
  );
  const responseObject = response.data[0];
  return responseObject;
};

export type TElevenlabsProps = {
  text: string;
};

export const textToSpeechOpenai = async (text: string, voice_id: string) => {
  const response = await axios.post(
    import.meta.env.VITE_APP_API_TTS_STT + "tts",
    {
      voice_id: voice_id,
      message: text,
    }
  );
  const responseObject = response.data[0];
  return responseObject;
};

export const chatbot = async (
  id: string,
  text: string,
  star: string,
  model: string
) => {
  const response = await axios.post(
    import.meta.env.VITE_APP_API_CHAT + "chat",
    {
      id: id,
      star: star,
      model: model,
      message: text,
    }
  );

  return response.data;
};

export const resetChatbot = async (id: string, star: string) => {
  const data = {
    id: id,
    star: star,
  };

  const config = {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  axios
    .post(import.meta.env.VITE_APP_API_CHAT + "reset", data, config)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};
