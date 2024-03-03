"use client";

const Page = () => {
  return (
    <div className="w-[500px] h-[500px] grid grid-cols-3  bg-green-100 overflow-hidden  ">
      <div className="border-1 ">
        <img src="/image.jpeg" alt="" className="object-cover self-stretch" />
      </div>
      <div className="border-1">
        <img src="/image.jpeg" alt="" className="object-cover" />
      </div>
      <div className="border-1">
        <img src="/image.jpeg" alt="" className="object-cover" />
      </div>
      <div className="border-1">
        <img src="/image.jpeg" alt="" className="object-cover" />
      </div>
    </div>
  );
};

export default Page;
