import BreadcrumbGenerator from "@/components/BreadcrumbsGenerator";
import { SidebarAndBreadCrumbs } from "./navigations";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-muted/40 min-h-screen">
      <main
        className={cn(
          "rounded-md flex flex-row md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
          "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
        )}
      >
        <SidebarAndBreadCrumbs />
        <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 w-full h-full">
          <header>
            <BreadcrumbGenerator />
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
