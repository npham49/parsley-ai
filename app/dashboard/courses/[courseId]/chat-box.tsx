"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import AIChat from "./ai-chat";
import UserChat from "./user-chat";
import { type CoreMessage } from "ai";
import { useState } from "react";
import { continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function ChatBox() {
  const searchParams = useSearchParams();
  const search = searchParams.get("docs");
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState("");
  return (
    <Card className="h-full rounded-none border-0">
      <CardContent className="flex h-full flex-col p-4">
        <h2 className="mb-4 text-2xl font-bold">Chat with AI Tutor</h2>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-8">
            <div className="mb-4 flex flex-col-reverse justify-end">
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <UserChat
                    key={i}
                    message={m.content as string}
                    time="12:37 PM"
                  />
                ) : (
                  <AIChat
                    key={i}
                    message={m.content as string}
                    time="12:38 PM"
                  />
                ),
              )}
            </div>
          </div>
        </main>
        <footer>
          <form
            className="flex items-start border-t px-4 py-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const newMessages: CoreMessage[] = [
                ...messages,
                { content: input, role: "user" },
              ];

              setMessages(newMessages);
              setInput("");

              const result = await continueConversation(
                newMessages,
                search
                  ? search.split(",").map((id) => parseInt(id))
                  : undefined,
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
            }}
          >
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
              className="ml-2 rounded-full"
            >
              <SendIcon className="h-6 w-6 text-primary" />
              <span className="sr-only">Send Message</span>
            </Button>
          </form>
        </footer>
      </CardContent>
    </Card>
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
