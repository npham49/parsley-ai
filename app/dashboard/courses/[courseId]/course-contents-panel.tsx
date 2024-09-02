"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectDocument } from "@/db/schema";
import { Trash2 } from "lucide-react";
import { deleteDocumentAction } from "./actions";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

export default function CourseContentPanel({
  document,
}: {
  document: SelectDocument[];
}) {
  const searchParams = useSearchParams();
  const toast = useToast();
  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: number) =>
      deleteDocumentAction({ id: documentId }),
    onSuccess: (e) => {
      if (e?.serverError) {
        toast.toast({
          title: "Error",
          description: e.serverError,
          variant: "destructive",
        });
        return;
      }

      toast.toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    },
  });

  const handleDocumentSelect = (docId: number) => {
    const currentDocs = searchParams.get("docs")?.split(",").map(Number) || [];
    let newDocs: number[];

    if (currentDocs.includes(docId)) {
      newDocs = currentDocs.filter((id) => id !== docId);
    } else {
      newDocs = [...currentDocs, docId];
    }

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("docs", newDocs.join(","));

    // Update the URL without navigating
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  };

  return (
    <ScrollArea className="h-[calc(100vh-200px)] lg:h-[calc(100vh-300px)]">
      {document.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Checkbox
              id={`doc-${doc.id}`}
              checked={searchParams.get("docs")?.includes(String(doc.id))}
              onCheckedChange={() => handleDocumentSelect(doc.id)}
            />
            <label htmlFor={`doc-${doc.id}`} className="ml-2">
              {doc.title}
            </label>
          </div>
          <Button variant="ghost" size="icon">
            <Trash2
              className="h-4 w-4"
              onClick={() => deleteDocumentMutation.mutate(doc.id)}
            />
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
