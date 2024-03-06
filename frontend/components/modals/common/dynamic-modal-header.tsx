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
    <div className="flex w-full bg-green-100 p-[20px] justify-between font-medium text-[18px] text-gray-700 ">
      {onBackClick && (
        <div className="flex w-4 justify-center items-center ">back</div>
      )}
      <h2 className="">{name}</h2>
      {onCloseClick && (
        <div className="flex w-4 justify-center items-center ">close</div>
      )}
    </div>
  );
};

export default DynamicModalHeader;
