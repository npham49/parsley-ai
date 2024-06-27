"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/zMiJFtjy2hq
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import AddCourseModal from "./AddCourseModal";
import { SelectCourse } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/app/dashboard/actions";

export default function Dashboard({
  initialData,
}: {
  initialData: SelectCourse[];
}) {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await getCourses();
      if (response?.serverError) {
        throw new Error(response.serverError);
      }
      if (!response?.data) {
        throw new Error("Failed to fetch courses");
      }
      return response?.data;
    },
    initialData: initialData,
    refetchOnMount: true
  });

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="bg-slate-800 px-4 lg:px-6 h-14 flex items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="flex text-primary-foreground items-center justify-center text-xl font-bold">
                Dashboard
              </span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/dashboard"
                  className="text-sm text-primary-foreground font-medium hover:underline hover:text-slate-400 underline-offset-4"
                  prefetch={false}
                >
                  Courses
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 bg-muted/40 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                All Courses
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mt-2">
                Browse and manage the courses you&apos;re currently enrolled in.
              </p>
            </div>
            <AddCourseModal />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
            {data.map((course) => (
              <div key={course.id}>
                <Card>
                  <CardHeader>
                    <div className="text-wrap">
                      <CardTitle>{course.title}</CardTitle>
                    </div>
                    <CardDescription>{course.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {course.syllabuslink && (
                      <div className="flex items-center justify-between">
                        <Link href={course.syllabuslink} prefetch={false} target="_blank">
                          View Syllabus
                        </Link>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">View Documents</Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
