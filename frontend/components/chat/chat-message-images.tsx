import Image from "next/image";

const MessageImages = ({ images }: { images: string[] }) => {
  return (
    <div className="flex">
      {images.map((image) => (
        // render image
        null
      ))}
    </div>
  );
};

export default MessageImages;
