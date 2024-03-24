import PictureDropzone from "@/components/picture-dropzone";
import DynamicChatMenuButton from "../common/dynamic-chat-menu-button";
import DynamicModalHeader from "../common/dynamic-modal-header";
import { DynamicModalBody } from "../modal-dynamic-wrapper";
import Delimiter from "../common/delimiter";
import StaticModalWrapper from "../static-modal-wrapper";
import FooterButton from "../common/footer-button";
import StaticModalHeader from "../common/static-modal-header";
import UnderlinedInput from "@/components/underlined-input";

interface InitialSettingsMenuProps {
  onCloseClick: () => void;
  image: string | undefined | null;
  onInfoClick?: () => void;
}
export const InitialSettingsMenu = ({
  onCloseClick,

  image,
  onInfoClick,
}: InitialSettingsMenuProps) => {
  return (
    <>
      <DynamicModalHeader onCloseClick={onCloseClick} name="Settings" />
      <DynamicModalBody>
        <div className="h-[100px] flex items-center ">
          <PictureDropzone
            image={image}
            className="text-[50px] w-20 h-20 bg-black mx-5"
          />
          <div className="flex flex-col justify-center ">
            <p className="font-semibold text-[19px]">name</p>
            <p className="text-gray-400 font-light text-[14px]">email</p>
            <p className="text-gray-400 font-light text-[14px]">@tag</p>
          </div>
        </div>
        <DynamicChatMenuButton onClick={onInfoClick} name="My Account" />
        <DynamicChatMenuButton name="Notifications and Sounds" />
        <DynamicChatMenuButton name="Privacy and Security" />
        <DynamicChatMenuButton name="Chat settings" />
        <DynamicChatMenuButton name="Folders" />
        <DynamicChatMenuButton name="Advanced" />
        <DynamicChatMenuButton name="Call Settings" />
        <DynamicChatMenuButton name="Battary and Animations" />
        <DynamicChatMenuButton name="Language" />

        <div></div>
      </DynamicModalBody>
    </>
  );
};

// *******************************************************

interface InfoSettingsMenuProps {
  onCloseClick: () => void;
  onBackClick: () => void;
}
export const InfoSettingsMenu = ({
  onCloseClick,
  onBackClick,
}: InfoSettingsMenuProps) => {
  return (
    <>
      <DynamicModalHeader
        onBackClick={onBackClick}
        onCloseClick={onCloseClick}
        name="Info"
      />
      <DynamicModalBody>
        <StaticModalWrapper isOpen={true} animation="fade" onClose={() => null}>
          <div className="h-[230px] w-[340px]">
            <StaticModalHeader name="Edit your name"/>
            <div className=" flex flex-col justify-between">
                <div className="px-7">
                    <UnderlinedInput label="Name"/>
                    <UnderlinedInput label="Name"/>
                </div>
                <div className="flex px-4 justify-end item">
                  <FooterButton name="Cancel" />
                  <FooterButton name="Submit" />
                </div>
            </div>
          </div>
        </StaticModalWrapper>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="flex flex-col">
          <div className="flex w-full flex-col items-center mb-0">
            <PictureDropzone className="w-[110px] h-[110px] mb-3" />
            <h2 className="font-semibold text-[19px]">Name</h2>
            <p className="text-light-200 font-normal text-[14px]">online</p>
          </div>
          <input
            placeholder="Bio"
            className="placeholder:text-[14px] placeholder:translate-x-1 my-4 text-[15px] outline-none w-full px-5 caret-[1px]"
            type="text"
          />
          <Delimiter
            className="mb-3"
            text="Any details such as age, occupation or city"
          />
          <DynamicChatMenuButton name="Name" />
          <DynamicChatMenuButton name="Email" />
          <DynamicChatMenuButton name="Username" />
          <Delimiter
            className="mb-3"
            text="Username lets other telegram users.."
          />
        </div>
      </DynamicModalBody>
    </>
  );
};
