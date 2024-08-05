"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function AIChat({
  message,
  time,
}: {
  message: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Avatar className="w-8 h-8">
        <AvatarImage src="/placeholder-user.jpg" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div className="grid gap-1 bg-card p-2 rounded-lg">
        <p>{message}</p>
        <div className="text-xs text-muted-foreground">{time}</div>
      </div>
    </div>
  );
}
