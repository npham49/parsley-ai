import BreadcrumbGenerator from "@/components/BreadcrumbsGenerator";
import { SidebarAndBreadCrumbs } from "./navigations";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-muted/40">
      <main
        className={cn(
          "rounded-md flex flex-row md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700",
          "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
        )}
      >
        <SidebarAndBreadCrumbs />
        <div className="p-2 md:pt-5 md:px-5 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 w-full h-full">
          <header>
            <BreadcrumbGenerator />
          </header>
          {children}
          <footer className="flex flex-col gap-2 h-6 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t z-0">
            <p className="text-xs text-muted-foreground">
              &copy; 2024 AI App. All rights reserved.
            </p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <Link
                href="#"
                className="text-xs hover:underline underline-offset-4"
                prefetch={false}
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-xs hover:underline underline-offset-4"
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
