/**
 * v0 by Vercel.
 * @see https://v0.dev/t/LxOTyFgqZQh
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import AIChat from "./ai-chat";
import UserChat from "./user-chat";

export default function ChatBox() {
  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Chat</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="w-6 h-6">
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="sr-only">User Profile</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 h-[500px]">
            <AIChat message="Hello! how can i help" time="12:36 PM" />
            <UserChat message="I need help with design" time="12:37 PM" />
            <AIChat message="Sure! I can help with that" time="12:38 PM" />
          </div>
        </div>
      </main>
      <footer className="flex items-center px-4 py-2 border-t">
        <div className="flex-1 flex items-center gap-2 px-2 py-1 rounded-lg bg-input">
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent focus:outline-none"
          />
        </div>
        <Button variant="ghost" size="icon" className="rounded-full ml-2">
          <SendIcon className="w-6 h-6 text-primary" />
          <span className="sr-only">Send Message</span>
        </Button>
      </footer>
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
