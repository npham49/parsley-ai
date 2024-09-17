import BreadcrumbGenerator from "@/components/BreadcrumbsGenerator";
import { ModeToggle } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full">
      <main
        className={cn(
          "mx-auto flex w-full flex-1 flex-row rounded-md border-t border-neutral-200 dark:border-neutral-700 md:flex-row",
          "h-auto md:h-screen",
        )}
      >
        <div className="flex h-full w-full flex-col gap-2 p-2 md:px-5 md:pt-5">
          <header className="flex w-full justify-between">
            <BreadcrumbGenerator />
            <div className="flex gap-4">
              <ModeToggle />
              <UserButton />
            </div>
          </header>
          {children}
          <footer className="z-0 flex h-6 w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
            <p className="text-xs text-muted-foreground">
              &copy; 2024 AI App. All rights reserved.
            </p>
            <nav className="flex gap-4 sm:ml-auto sm:gap-6">
              <Link
                href="#"
                className="text-xs underline-offset-4 hover:underline"
                prefetch={false}
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-xs underline-offset-4 hover:underline"
                prefetch={false}
              >
                Privacy
              </Link>
            </nav>
          </footer>
        </div>
      </main>
    </div>
  );
}
