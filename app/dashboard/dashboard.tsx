"use client";
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
import AddCourseModal from "./add-course-modal";
import { SelectCourse } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/app/dashboard/actions";

export default function Dashboard({
  initialData,
}: {
  initialData: SelectCourse[];
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await getCourses(null);
      if (response?.serverError) {
        throw new Error(response.serverError);
      }
      if (!response?.data) {
        throw new Error("Failed to fetch courses");
      }
      return response?.data;
    },
    initialData: initialData,
  });

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-3xl">
            All Courses
          </h1>
          <p className="text-muted-foreground md:text-md mt-2">
            Browse and manage the courses you&apos;re currently enrolled in.
          </p>
        </div>
        <AddCourseModal />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading && <p>Loading...</p>}
        {error && <p>{error.message}</p>}
        {data.map((course: SelectCourse) => (
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
                    <Link
                      href={course.syllabuslink}
                      prefetch={false}
                      target="_blank"
                    >
                      View Syllabus
                    </Link>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/courses/${course.id}`}>
                  <Button className="w-full">View Documents</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
