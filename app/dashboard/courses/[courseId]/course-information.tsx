import { SelectCourse } from "@/db/schema";
import { SquarePlus, Upload } from "lucide-react";
import AddContentDialog from "./add-content-dialog";
import ChatBox from "./chat-box";
import CourseContentPanel from "./course-contents-panel";
import { getCourseDocumentsAction } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default async function CourseInformation({
  course,
}: {
  course: SelectCourse;
}) {
  const documents = await getCourseDocumentsAction({
    courseId: course.id,
  });

  return (
    <Card className="h-[90vh] min-h-[80vh] rounded-md border-0 pb-8 md:min-h-[85vh]">
      <CardContent className="h-full p-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Manage Knowledgebase</Button>
          </PopoverTrigger>
          <PopoverContent className="w-100 h-auto">
            <h2 className="text-2xl font-bold">Knowledge base</h2>
            <p className="mb-4 align-sub text-sm">
              This is where you can select which documents the AI Tutor can use
              to answer questions.
            </p>
            <div className="mb-4">
              <AddContentDialog courseId={course.id}>
                <label htmlFor="file-upload">
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" /> Add new course content
                  </Button>
                </label>
              </AddContentDialog>
            </div>
            {documents !== undefined && documents.serverError ? (
              <div className="text-red-500">{documents.serverError}</div>
            ) : (
              <CourseContentPanel document={documents?.data || []} />
            )}
          </PopoverContent>
        </Popover>
        <ChatBox course={course} />
      </CardContent>
    </Card>
  );
}
