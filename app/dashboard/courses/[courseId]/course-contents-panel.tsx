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
import { Edit2Icon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function CourseContentPanel({
  document,
}: {
  document: SelectDocument[];
}) {
  const [error, setError] = useState<string | null>(null);
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

    if (newDocs.length === 0) {
      setError("At least one document should be selected");
      return;
    } else {
      setError(null);
    }
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("docs", newDocs.join(","));

    // Update the URL without navigating
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    // if the params are empty then set it to all documents
    if (searchParams.get("docs") === null) {
      const allDocs = document.map((doc) => doc.id);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("docs", allDocs.join(","));
      window.history.pushState(null, "", `?${newSearchParams.toString()}`);
    }
  }, []);

  return (
    <ScrollArea className="h-[calc(100vh-200px)] lg:h-[calc(100vh-300px)]">
      {error && <div className="text-center text-sm text-red-500">{error}</div>}
      {document.map((doc) => (
        <div key={doc.id} className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox
              id={`doc-${doc.id}`}
              checked={searchParams
                .get("docs")
                ?.split(",")
                ?.includes(String(doc.id))}
              onCheckedChange={() => handleDocumentSelect(doc.id)}
            />
            <label htmlFor={`doc-${doc.id}`} className="ml-2 text-sm">
              {doc.title}
            </label>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="min-w-4">
              <Edit2Icon className="h-4 w-4" />
            </Button>
            <DeleteConfirmationPopover
              title={doc.title}
              mutation={deleteDocumentMutation}
              id={doc.id}
            >
              <Button variant="ghost" size="icon" className="min-w-4">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DeleteConfirmationPopover>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}
