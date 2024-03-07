import { ChangeEvent, useState } from "react";
import MembersList from "../common/members-list";
import { Member } from "@/types";
import DynamicModalHeader from "../common/dynamic-modal-header";
import { DynamicModalBody } from "../modal-dynamic-wrapper";
import Search from "../common/search";
import { motion } from "framer-motion";

const MembersMenu = ({
  members,
  onBackClick,
  onCloseClick,
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
    <motion.div
    // animate={{ x: 0, opacity: 1 }}
    // exit={{ x: "-30%", opacity: 0 }}
    // transition={{ duration: 0.1 }}
    >
      <DynamicModalHeader
        onBackClick={onBackClick}
        onCloseClick={onCloseClick}
        name="Name"
      />
      <DynamicModalBody>
        <Search />
        <div className="w-full border-t-1 h-[10px] mt-1" />
        <MembersList members={filteredMembers} />
      </DynamicModalBody>
    </motion.div>
  );
};

export default MembersMenu;
