import Image from "next/image";

const MessageImages = ({ images }: { images: string[] }) => {
  return (
    <div className="flex">
      {images.map((image) => (
        <Image width={200} height={300} src={image} alt="text" />
      ))}
    </div>
  );
};

export default MessageImages;
