import { ChangeEvent, useState } from "react";
import MembersList from "./members-list";
import { Member } from "@/types";

const MembersMenu = ({ members }: { members: Member[] }) => {
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
      <input onChange={handleChange} type="text" />
      <MembersList members={filteredMembers} />;
    </div>
  );
};

export default MembersMenu;
