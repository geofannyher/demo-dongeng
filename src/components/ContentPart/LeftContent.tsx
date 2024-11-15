import {
  KeyboardArrowDownIcon,
  KeyboardArrowRightIcon,
} from "../../data/icons";

const LeftContent = () => {
  return (
    <div className="flex flex-col space-y-5 w-1/4 p-4">
      <div className="text-3xl text-white font-bold">OWDI</div>
      <div className="space-y-2 ">
        <h1 className="text-white text-sm font-semibold">
          Own Digital Companion
        </h1>
        <p className="text-white text-sm font-normal">
          your digital friend who is always ready to help you with your daily
          activities, making life simpler and more fun!
        </p>
      </div>
      <button className="text-white  bg-gradient-to-r flex items-center justify-between px-4 from-orange-600 to-orange-400 font-semibold py-4 rounded-xl border border-orange-600 shadow-lg mb-4">
        Buat Sesi Obrolan Baru <KeyboardArrowRightIcon fontSize="small" />
      </button>

      {/* Chat history*/}
      <div className="bg-[#FEE0D9] rounded-xl shadow-lg p-4 w-72">
        <div className="flex items-center justify-between pb-2 border-b border-opacity-50 border-[#FF8B79]">
          <h2 className="font-semibold text-[#333E4F] text-lg">
            Riwayat Obrolan
          </h2>
          <KeyboardArrowDownIcon fontSize="small" className="text-[#333E4F]" />
        </div>
        <ul className="mt-3 text-[#333E4F]">
          <span className="text-xs text-[#A8A8A8]">31 Oktober 2024</span>
          <li className="flex py-4  justify-between items-center text-sm">
            <span className="font-semibold">Owdi Ceritakan film Angkasa</span>
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
  );
};
export default LeftContent;
