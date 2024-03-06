import { ChangeEvent, useState } from "react";
import MembersList from "../common/members-list";
import { Member } from "@/types";
import DynamicModalHeader from "../common/dynamic-modal-header";

const MembersMenu = ({
  members,
  onBackClick,
  onCloseClick
}: {
  members: Member[];
  onBackClick?: () => void;
  onCloseClick?: () => void;
}) => {
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter((member) => {
    const searchName: string = member.userId.name || member.userId.email;
    if (searchName.startsWith(search)) return true;
    return false;
  });

  const handleChange = (e: ChangeEvent) => {
    setSearch(e.target.textContent as string);
  };

  return (
    <div>
      <DynamicModalHeader name="Name" />
      <input onChange={handleChange} type="text" />
      <MembersList members={filteredMembers} />;
    </div>
  );
};

export default MembersMenu;
