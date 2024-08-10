import { SelectDocument } from "@/db/schema";

export default function CourseContentPanel({
  document,
}: {
  document: SelectDocument[];
}) {
  return (
    <div>
      {document.map((doc) => (
        <div
          key={doc.id}
          className="w-full h-auto p-4 border-2 border-secondary bg-background rounded-md shadow-sm flex flex-row hover:bg-muted-foreground/20 cursor-pointer"
        >
          <p>{doc.title}</p>
        </div>
      ))}
    </div>
  );
}
