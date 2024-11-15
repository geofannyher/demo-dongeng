import { AddIcon, PaidIcon } from "../../data/icons";

const Header = () => {
  return (
    <div>
      <div className="flex justify-center w-full py-4">
        <button className="background-color-btn flex gap-2 items-center justify-center font-semibold text-white px-4 py-2 rounded-full">
          <PaidIcon className="text-yellow-600" fontSize="small" /> 50 credits
          tersisa <AddIcon />
        </button>
      </div>
    </div>
  );
};

export default Header;
