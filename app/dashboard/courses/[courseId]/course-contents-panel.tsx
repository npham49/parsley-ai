import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectDocument } from "@/db/schema";
import { Trash2 } from "lucide-react";

export default function CourseContentPanel({
  document,
}: {
  document: SelectDocument[];
}) {
  return (
    <ScrollArea className="h-[calc(100vh-200px)] lg:h-[calc(100vh-300px)]">
      {document.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {/* <Checkbox
            id={`doc-${doc.id}`}
            checked={doc.selected}
            onCheckedChange={() => handleDocumentSelect(doc.id)}
          /> */}
            <label htmlFor={`doc-${doc.id}`} className="ml-2">
              {doc.title}
            </label>
          </div>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        // <div
        //   key={doc.id}
        //   className="w-full h-auto p-4 border-2 border-secondary bg-background rounded-md shadow-sm flex flex-row hover:bg-muted-foreground/20 cursor-pointer"
        // >
        //   <p>{doc.title}</p>
        // </div>
      ))}
    </ScrollArea>
  );
}
