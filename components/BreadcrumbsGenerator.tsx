"use client";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import { usePathname } from "next/navigation";

export default function BreadcrumbGenerator() {
  const pathname = usePathname();

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Breadcrumb className="flex text-white">
      <BreadcrumbList>
        {pathname.split("/").map((path, index) => {
          if (path === "") return;
          return (
            <div
              key={index}
              className="flex flex-row items-center align-middle"
            >
              {index > 1 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  {/* href should be the summ of previous elements */}
                  <Link href={pathname.split(path)[0] + path}>
                    {capitalizeFirstLetter(path)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
