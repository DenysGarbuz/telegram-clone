import Avatar from "@/components/avatar";
import { Member } from "@/types";

const MembersList = ({
  members,
  onMemberClick,
}: {
  members: Member[];
  onMemberClick?: (member: Member) => void;
}) => {
  return (
    <div className="flex flex-col">
      {members.map((member) => (
        <ContactItem
          key={member._id}
          onClick={onMemberClick ? () => onMemberClick(member) : undefined}
          imageUrl={member.userId.imageUrl}
          name={member.userId.name || member.userId.email}
          activity="online"
        />
      ))}
    </div>
  );
};

interface ContactItemProps {
  name: string;
  activity: string;
  imageUrl: string | null;
  onClick?: () => void;
}
const ContactItem = ({
  name,
  activity,
  onClick,
  imageUrl,
}: ContactItemProps) => {
  return (
    <div
      onClick={onClick}
      className="h-[62px] flex items-center hover:bg-gray-100"
    >
      <Avatar
        imageUrl={imageUrl}
        name={name.charAt(0)}
        className="w-[45px] h-[45px] text-[20px] mx-4 rounded-full bg-black"
      />
      <div className="flex flex-col ">
        <p className="text-[14px] font-semibold">{name}</p>
        <p className="text-gray-400 font-light text-sm">{activity}</p>
      </div>
    </div>
  );
};

export default MembersList;
