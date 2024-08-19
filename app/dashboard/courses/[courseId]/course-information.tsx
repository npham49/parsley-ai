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
    <div className="container mx-auto p-4 h-auto flex flex-col lg:flex-row">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={30}>
          <Card className="mb-4 lg:mb-0 lg:mr-2">
            <CardContent className="p-4">
              <h2 className="text-2xl font-bold mb-4">Knowledge base</h2>
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
    </div>
  );
}
