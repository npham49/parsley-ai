"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectDocument } from "@/db/schema";
import { deleteDocumentAction } from "./actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteConfirmationPopover } from "@/components/delete-confirmation-popover";
import { Trash2 } from "lucide-react";

export default function CourseContentPanel({
  document,
}: {
  document: SelectDocument[];
}) {
  const searchParams = useSearchParams();
  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: number) =>
      deleteDocumentAction({ id: documentId }),
    onSuccess: (e) => {
      console.log(e);
      if (e?.serverError || e?.validationErrors) {
        toast({
          title: "Error",
          description: `${e.serverError || e.validationErrors}`,
          variant: "destructive",
        });
        return;
      }

      toast({
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
        <div key={doc.id} className="mb-2 flex items-center justify-between">
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
          <DeleteConfirmationPopover
            title={doc.title}
            mutation={deleteDocumentMutation}
            id={doc.id}
          >
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 min-w-4" />
            </Button>
          </DeleteConfirmationPopover>
        </div>
      ))}
    </ScrollArea>
  );
}
