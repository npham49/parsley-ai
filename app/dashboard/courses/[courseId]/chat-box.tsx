"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import AIChat from "./ai-chat";
import UserChat from "./user-chat";
import { type CoreMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { ButtonScrollToBottom } from "./scroll-to-bottom-button";
import AddContentDialog from "./add-content-dialog";
import { SelectCourse } from "@/db/schema";
import { Upload } from "lucide-react";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function ChatBox({ course }: { course: SelectCourse }) {
  const searchParams = useSearchParams();
  const search = searchParams.get("docs");
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  return (
    <div className="m-4 flex h-full flex-col">
      <h2 className="mb-4 text-2xl font-bold">Chat with AI Tutor</h2>
      <ScrollArea
        className="mx-auto h-4/5 w-full max-w-5xl overflow-y-auto"
        ref={scrollRef}
      >
        <ButtonScrollToBottom
          isAtBottom={isAtBottom}
          scrollToBottom={scrollToBottom}
        />
        <div className="flex flex-col" ref={messagesRef}>
          {messages.map((m, i) =>
            m.role === "user" ? (
              <UserChat key={i} message={m.content as string} />
            ) : (
              <AIChat key={i} message={m.content as string} />
            ),
          )}
          <div className="h-px w-full" ref={visibilityRef} />
        </div>
      </ScrollArea>
      <div>
        <form
          className="pt flex items-start px-4 pt-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            const newMessages: CoreMessage[] = [
              ...messages,
              { content: input, role: "user" },
            ];

            setMessages(newMessages);
            setInput("");

            const result = await continueConversation(
              newMessages,
              search ? search.split(",").map((id) => parseInt(id)) : undefined,
            );
            for await (const content of readStreamableValue(result)) {
              setMessages([
                ...newMessages,
                {
                  role: "assistant",
                  content: content as string,
                },
              ]);
            }
            setIsLoading(false);
          }}
        >
          <AddContentDialog courseId={course.id}>
            <label htmlFor="file-upload">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mr-4 rounded-full"
              >
                <Upload className="h-5 w-5 text-primary" />
              </Button>
            </label>
          </AddContentDialog>
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-input">
            <Input
              type="text"
              placeholder="Type your message..."
              className="max-h-40 flex-1 bg-transparent focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="ml-4 rounded-full"
          >
            <SendIcon className="h-5 w-5 text-primary" />
            <span className="sr-only">Send Message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

function SendIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
