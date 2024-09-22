import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";

export default function UserChat({ message }: { message: string }) {
  const { user } = useUser();
  return (
    <div className="flex items-start gap-2 self-end">
      <div className="grid gap-1 rounded-lg bg-primary p-2 text-sm text-primary-foreground">
        <p>{message}</p>
        {/* <div className="text-xs">{time}</div> */}
      </div>
      <Avatar className="h-8 w-8">
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
