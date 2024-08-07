import { SelectCourse } from "@/db/schema";
import { SquarePlus } from "lucide-react";
import Link from "next/link";
import AddContentDialog from "./add-content-dialog";
import { Button } from "@/components/ui/button";
import ChatBox from "./chat-box";

export default function CourseInformation({
  course,
}: {
  course: SelectCourse;
}) {
  return (
    <div className="h-[700px] overflow-scroll">
      {/* <div className="flex justify-between">
        <div className="flex flex-col">
          <h2 className=" text-4xl font-bold tracking-tighter sm:text-4xl md:text-3xl">
            Course: {course.title}
          </h2>
          <p className="text-muted-foreground md:text-md my-2">
            Course Summary: {course.summary}
          </p>
          {course.syllabuslink && (
            <Link
              href={course.syllabuslink}
              className=" font-semibold underline"
            >
              Syllabus
            </Link>
          )}
        </div>
        <Link href={`/dashboard/courses/${course.id}/edit`}>
          <Button>Edit Course</Button>
        </Link>
      </div> */}
      <div className="flex md:flex-row flex-col w-full h-full">
        <div className="border border-secondary bg-card w-2/6 p-2 md:p-4 rounded-md shadow-sm mr-1">
          <h3 className=" text-xl font-bold tracking-tighter sm:text-4xl md:text-xl">
            Contents
          </h3>
          <AddContentDialog courseId={course.id}>
            <div className="w-full h-auto p-4 border-2 border-secondary bg-background rounded-md shadow-sm flex flex-row hover:bg-muted-foreground/20 cursor-pointer">
              <SquarePlus />
              <p className="mx-2">Add New Content</p>
            </div>
          </AddContentDialog>
        </div>
        <div className="border border-secondary bg-card w-4/6 p-2 md:p-4 rounded-md shadow-sm">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
