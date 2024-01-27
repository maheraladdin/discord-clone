import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type MemberAvatarProps = {
  src?: string;
  alt?: string;
  className?: string;
};

export default function MemberAvatar({
  src,
  className,
  alt,
}: MemberAvatarProps) {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarImage
        src={src || "public/Portrait_Placeholder.png"}
        alt={alt}
        sizes={"28px, (min-width: 768px) 40px"}
      />
    </Avatar>
  );
}
