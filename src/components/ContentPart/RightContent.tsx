import TypingIndicator from "../TypeIndicator";
import TypewriterEffect from "../TypewriterEffect/TypewriterEffect";

const RightContent = ({
  isTyping,
  results,
  newestMessageId,
  handleReset,
}: {
  isTyping: boolean;
  results: [];
  newestMessageId: number | null;
  handleReset: () => void;
}) => {
  return (
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
  );
};

export default RightContent;
