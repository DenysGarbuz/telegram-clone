import { LiaSearchSolid } from "react-icons/lia";
import { RxCross2 } from "react-icons/rx";

const Search = ({
  onChange,
  value,
  onCrossClick,
}: {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  onCrossClick?: () => void;
}) => {
  return (
    <div className="flex h-[40px] overflow-hidden">
      <div className="w-14 text-gray-400 text-[20px] font-bold flex justify-center items-center">
        <LiaSearchSolid />
      </div>
      <input
        onChange={(e) => onChange(e)}
        type="text"
        value={value}
        placeholder="Search"
        className="flex-1  outline-none focus:ring-0 placeholder:text-[14px] placeholder:font-light bg-transparent"
      />
      {value?.length > 0 && (
        <div
          onClick={onCrossClick}
          className="w-10 text-gray-400 text-[20px] font-bold flex justify-center items-center cursor-pointer"
        >
          <RxCross2 />
        </div>
      )}
    </div>
  );
};

export default Search;
