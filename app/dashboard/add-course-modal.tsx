"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewCourse } from "@/app/dashboard/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { courseSchema } from "@/lib/zod-schemas/courses";
import { z } from "zod";

export default function AddCourseModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: z.infer<typeof courseSchema>) =>
      createNewCourse(formData),
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
      queryClient.invalidateQueries({ queryKey: ["courses"], exact: true });
      setOpen(false);
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      summary: "",
      syllabuslink: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof courseSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    mutate(values);
  }

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
          <Form {...form}>
            <form className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter course title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a brief summary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="syllabuslink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Syllabus Link</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="Enter syllabus URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          // <form
          //   className="grid gap-4"
          //   onSubmit={(e) => {
          //     e.preventDefault();
          //   }}
          // >
          //   <div className="grid gap-2">
          //     <Label htmlFor="title">Course Title</Label>
          //     <Input
          //       id="title"
          //       placeholder="Enter course title"
          //       onChange={(e) => {
          //         setFormData({ ...formData, title: e.target.value });
          //       }}
          //     />
          //   </div>
          //   <div className="grid gap-2">
          //     <Label htmlFor="summary">Course Summary</Label>
          //     <Textarea
          //       id="summary"
          //       placeholder="Provide a brief summary"
          //       onChange={(e) => {
          //         setFormData({ ...formData, summary: e.target.value });
          //       }}
          //     />
          //   </div>
          //   <div className="grid gap-2">
          //     <Label htmlFor="syllabuslink">Syllabus Link</Label>
          //     <Input
          //       id="syllabuslink"
          //       type="url"
          //       placeholder="Enter syllabus URL"
          //       onChange={(e) => {
          //         setFormData({ ...formData, syllabuslink: e.target.value });
          //       }}
          //     />
          //   </div>
          // </form>
        )}
        <DialogFooter>
          <Button onClick={form.handleSubmit(onSubmit)}>Add Course</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
