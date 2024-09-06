import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";

export default function UserChat({
  message,
  time,
}: {
  message: string;
  time: string;
}) {
  const { user } = useUser();
  return (
    <div className="flex items-start gap-2 self-end">
      <div className="grid gap-1 bg-primary p-2 rounded-lg text-primary-foreground">
        <p>{message}</p>
        <div className="text-xs">{time}</div>
      </div>
      <Avatar className="w-8 h-8">
        <AvatarImage src={user?.imageUrl} alt="User" />
        <AvatarFallback>
          {user?.fullName
            ? user.fullName.match(/\b\w/g)?.join("").toUpperCase()
            : "ME"}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
