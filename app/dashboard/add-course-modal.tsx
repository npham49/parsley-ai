"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewCourse } from "@/app/dashboard/actions";

export default function AddCourseModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    syllabuslink: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => createNewCourse(formData),
    onError: (error) => {
      return alert(error.message || "Failed to updated");
    },
    onSuccess: (e) => {
      console.log(e);
      if (e?.serverError) {
        alert(e.serverError);
        return;
      }
      // revalidate data or show success toast
      setFormData({
        title: "",
        summary: "",
        syllabuslink: "",
      });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Course</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Fill out the form to add a new course.
          </DialogDescription>
        </DialogHeader>
        {isPending ? (
          <p className="text-3xl">Adding Course...</p>
        ) : (
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                placeholder="Enter course title"
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="summary">Course Summary</Label>
              <Textarea
                id="summary"
                placeholder="Provide a brief summary"
                onChange={(e) => {
                  setFormData({ ...formData, summary: e.target.value });
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="syllabuslink">Syllabus Link</Label>
              <Input
                id="syllabuslink"
                type="url"
                placeholder="Enter syllabus URL"
                onChange={(e) => {
                  setFormData({ ...formData, syllabuslink: e.target.value });
                }}
              />
            </div>
          </form>
        )}
        <DialogFooter>
          <Button
            onClick={() => {
              mutate();
            }}
          >
            Add Course
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
