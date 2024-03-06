import { Member } from "@/types";
import MembersList from "../common/members-list";
import { useState } from "react";
import FooterButton from "../common/footer-button";
import { LiaSearchSolid } from "react-icons/lia";
import { RxCross2 } from "react-icons/rx";
import StaticModalHeader from "../common/static-modal-header";
import Toggle from "@/components/toggle";
import { twMerge } from "tailwind-merge";
import { BsX } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";
import axiosConfig from "@/utils/axios-config";
import queryString from "query-string";
import { headers } from "next/headers";
import useToken from "@/hooks/useToken";
import Avatar from "@/components/avatar";

interface AdministratorsMenuProps {
  members: Member[];
  onCloseClick: () => void;
}

type Menu = "default" | "settings" | "add";

const AdministratorsMenu = ({
  members,
  onCloseClick,
}: AdministratorsMenuProps) => {
  const [currentMenu, setCurrentMenu] = useState<Menu>("default");
  const [member, setMember] = useState<Member | null>(null);

  const handleMemberClick = (member: Member) => {
    setMember(member);
    setCurrentMenu("settings");
  };

  return (
    <>
      {currentMenu === "default" && (
        <AdministratorsInitialMenu
          onCloseClick={onCloseClick}
          onAddAdministratorClick={() => setCurrentMenu("add")}
          members={members}
          onMemberClick={handleMemberClick}
        />
      )}
      {currentMenu === "settings" && member && (
        <AdministratorSettingsMenu
          onCancelClick={() => setCurrentMenu("default")}
          member={member}
        />
      )}
      {currentMenu === "add" && (
        <AdministratorAddAdministratorMenu
          members={members}
          onMemberClick={handleMemberClick}
          onCanselClick={() => setCurrentMenu("default")}
        />
      )}
    </>
  );
};

export default AdministratorsMenu;

const AdministratorsInitialMenu = ({
  members,
  onMemberClick,
  onCloseClick,
  onAddAdministratorClick,
}: {
  members: Member[];
  onMemberClick: (member: Member) => void;
  onCloseClick: () => void;
  onAddAdministratorClick: () => void;
}) => {
  const [search, setSearch] = useState("");
  const admins = members.filter((member) => {
    const filterName: string = member.userId.name || member.userId.email;
    return member.isAdmin && filterName.startsWith(search);
  });

  return (
    <div className="w-[400px] h-[640px] flex-shrink-1  flex flex-col text-gray-1000">
      <StaticModalHeader name="Administrators" />
      <Search
        onChange={(e) => setSearch(e.target.value)}
        onCrossClick={() => setSearch("")}
        value={search}
      />
      <div className="w-full border-t-1 h-[10px] mt-1" />
      <div className="overflow-auto flex-1">
        <MembersList
          onMemberClick={(member) => onMemberClick(member)}
          members={admins}
        />
      </div>
      <div className="items-center flex justify-between   px-3">
        <FooterButton
          name="Add Administrator"
          onClick={onAddAdministratorClick}
        />
        <FooterButton name="Close" onClick={onCloseClick} />
      </div>
    </div>
  );
};

const AdministratorSettingsMenu = ({
  member,
  onCancelClick,
}: {
  member: Member;
  onCancelClick: () => void;
}) => {
  const [rights, setRights] = useState(member.rights);
  const token = useToken();

  const handleSave = async () => {
    const url = queryString.stringifyUrl({
      url: "/api/members/rights",
      query: {
        memberId: member._id,
        chatId: member.chatId,
      },
    });

    console.log(rights);
    await axiosConfig.post(url, rights, {
      headers: { Authorization: "Bearer " + token },
    });
    onCancelClick();
  };

  return (
    <div className="w-[400px]  flex flex-col text-gray-1000">
      <StaticModalHeader name="Add Administrator" />
      <div className="flex items-center overflow-scroll ">
        <div className="ml-7 mr-4">
          <Avatar
            className="w-[65px] h-[65px] bg-black text-white text-[40px]"
            imageUrl={member.userId.imageUrl}
            name={
              member.userId.name
                ? member.userId.name.charAt(0)
                : member.userId.email.charAt(0)
            }
          />
        </div>
        <div className="flex flex-col">
          <p className="text-[15px] font-medium">
            {member.userId.name || member.userId.email}
          </p>
          <p className="text-gray-400 font-light text-[14px]">
            last seen recently
          </p>
        </div>
      </div>
      <div className="flex flex-col ">
        <p className="text-[15px] select-none font-medium text-sky-600 pb-2 pt-7 px-7">
          What can this admin do?
        </p>
        <AdministratorSettingOption
          name="Change group info"
          isChecked={rights.canAddNewAdmins}
          onChange={(isChecked) =>
            setRights({ ...rights, canAddNewAdmins: isChecked })
          }
        />
        <AdministratorSettingOption
          name="Delete messages"
          isChecked={rights.canDeleteMessages}
          onChange={(isChecked) =>
            setRights({ ...rights, canDeleteMessages: isChecked })
          }
        />
        <AdministratorSettingOption
          name="Ban users"
          isChecked={rights.canBanUsers}
          onChange={(isChecked) =>
            setRights({ ...rights, canBanUsers: isChecked })
          }
        />
        <AdministratorSettingOption
          name="Invite user via link"
          isChecked={rights.canAddMembers}
          onChange={(isChecked) =>
            setRights({ ...rights, canAddMembers: isChecked })
          }
        />
        <AdministratorSettingOption
          name="Pin messages"
          isChecked={rights.canPinMessages}
          onChange={(isChecked) =>
            setRights({ ...rights, canPinMessages: isChecked })
          }
        />
        <AdministratorSettingOption
          disabled
          name="Manage video chats"
          isChecked={false}
        />
        <AdministratorSettingOption
          disabled
          name="Remain anonymous"
          isChecked={false}
        />
        <AdministratorSettingOption
          name="Add new admins"
          isChecked={rights.canAddNewAdmins}
          onChange={(isChecked) =>
            setRights({ ...rights, canAddNewAdmins: isChecked })
          }
        />
        <p className="text-[14px] select-none font-light text-gray-400/90 py-2 px-7">
          This admin wont ba able to add admins
        </p>
        <p className="text-[15px] select-none font-medium text-sky-600 pb-2 pt-7 px-7">
          Custom title
        </p>
        <p className="text-[14px] select-none font-light text-gray-400/90 py-2 px-7">
          A title that member will see instead of 'admin'
        </p>
      </div>
      <div className="items-center flex justify-end   px-3">
        <FooterButton name="Cancel" onClick={onCancelClick} />
        <FooterButton name="Save" onClick={handleSave} />
      </div>
    </div>
  );
};

const AdministratorSettingOption = ({
  isChecked,
  onChange,
  name,
  disabled,
}: {
  isChecked: boolean;
  onChange?: (isChecked: boolean) => void;
  name: string;
  disabled?: boolean;
}) => {
  return (
    <Toggle
      isChecked={isChecked}
      onChange={onChange}
      offIcon={
        <div className="text-[20px]">
          <BsX />
        </div>
      }
      onIcon={
        <div className="text-[13px]">
          {" "}
          <FaCheck />
        </div>
      }
      styles={{
        wrapper:
          "flex h-[40px] hover:bg-gray-100 justify-between items-center px-7",
      }}
    >
      <div
        className={twMerge(
          "text-[14px] select-none font-normal",
          disabled && "text-gray-300"
        )}
      >
        {name}
      </div>
    </Toggle>
  );
};

const AdministratorAddAdministratorMenu = ({
  members,
  onMemberClick,
  onCanselClick,
}: {
  members: Member[];
  onMemberClick: (member: Member) => void;
  onCanselClick: () => void;
}) => {
  const [search, setSearch] = useState("");
  const filteredMembers = members.filter((member) => {
    const filterName: string = member.userId.name || member.userId.email;
    return filterName.startsWith(search);
  });

  return (
    <div className="w-[400px] h-[640px] flex-grow flex flex-col text-gray-1000">
      <StaticModalHeader name="Add Administrator" />
      <Search
        onChange={(e) => setSearch(e.target.value ?? "")}
        value={search}
        onCrossClick={() => setSearch("")}
      />
      <div className="w-full border-t-1 h-[10px] mt-1" />
      <div className="overflow-auto flex-1">
        <MembersList
          onMemberClick={(member) => onMemberClick(member)}
          members={filteredMembers}
        />
      </div>
      <div className="items-center flex justify-end   px-3">
        <FooterButton name="Cancel" onClick={onCanselClick} />
      </div>
    </div>
  );
};

const Search = ({
  onChange,
  value,
  onCrossClick,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  onCrossClick: () => void;
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
