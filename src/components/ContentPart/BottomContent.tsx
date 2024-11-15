import { cardData } from "../../data";
import {
  CakeIcon,
  Face6Icon,
  ImportContactsIcon,
  PaidIcon,
  VideocamIcon,
} from "../../data/icons";

const BottomContent = ({ startStory }: { startStory: boolean }) => {
  return (
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
                      <PaidIcon fontSize="small" className="text-yellow-600" />{" "}
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
  );
};

export default BottomContent;
