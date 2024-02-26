import { FaFile } from "react-icons/fa6";

const MessgeFiles = ({ files }: { files: string[] }) => {
  const handleDownload = (url: string) => {
    // Create a hidden link element
    const link = document.createElement("a");
    link.href = url;
    link.download = "fileName";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="flex flex-col max-w-[400px] overflow-hidden">
      {files.map((file, i) => (
        <div
          key={i}
          className="flex px-3 py-1.5 cursor-pointer"
          onClick={() => handleDownload(file)}
        >
          <div className="rounded-full w-12 h-12 bg-green-500  flex justify-center items-center text-[20px] text-white">
            <FaFile />
          </div>
          <div className="flex flex-col ml-3">
            <p className="font-semibold text-[15px]">Name</p>
            <p className="font-light text-[14px] text-green-500">Size</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessgeFiles;
