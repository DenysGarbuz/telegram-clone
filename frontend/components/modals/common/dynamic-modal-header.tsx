import { IoArrowBackOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const DynamicModalHeader = ({
  name,
  onBackClick,
  onCloseClick,
}: {
  name: string;
  onBackClick?: () => void;
  onCloseClick?: () => void;
}) => {
  return (
    <div className="flex w-full  justify-between  p-[20px]  font-medium text-[18px]  text-gray-700 ">
      <div className="flex">
        {onBackClick && (
          <button
            className="text-[25px] mr-[30px] text-gray-400 hover:brightness-90"
            onClick={onBackClick}
          >
            <IoArrowBackOutline />
          </button>
        )}
        <h2 className="">{name}</h2>
      </div>
      {onCloseClick && (
        <div className=" flex justify-center items-center ">
          <button
            onClick={onCloseClick}
            className="px-1 text-[25px] text-gray-400 hover:brightness-90 "
          >
            <RxCross2 />
          </button>
        </div>
      )}
    </div>
  );
};

export default DynamicModalHeader;
