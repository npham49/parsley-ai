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

export default async function CourseInformation({
  course,
}: {
  course: SelectCourse;
}) {
  const documents = await getCourseDocumentsAction({
    courseId: course.id,
  });

  return (
    <ResizablePanelGroup direction="horizontal" className="rounded-md">
      <ResizablePanel defaultSize={30} minSize={20}>
        <Card className="h-full min-h-screen rounded-none border-0 md:min-h-0">
          <CardContent className="h-full overflow-y-auto p-4">
            <h2 className="mb-4 text-2xl font-bold">Knowledge base</h2>
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
          </CardContent>
        </Card>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70} minSize={30}>
        <ChatBox />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
