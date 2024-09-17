"use client";
import { marked } from "marked";
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
      <Avatar className="h-8 w-8">
        <AvatarImage src="/placeholder-user.jpg" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div
        className="prose grid gap-1 rounded-lg bg-card p-2 dark:prose-invert"
        dangerouslySetInnerHTML={{
          __html: marked.parse(
            message.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ""),
          ),
        }}
      >
        {/* <p>{message}</p> */}
        {/* <div className="text-xs text-muted-foreground">{time}</div> */}
      </div>
    </div>
  );
}
