"use client";

import { SelectCourse } from "@/db/schema";
import { UpdateCourseSchema } from "@/lib/zod-schemas/courses";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { updateCourseAction } from "./actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default function CourseEditForm({ course }: { course: SelectCourse }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (values: z.infer<typeof UpdateCourseSchema>) =>
      updateCourseAction(values),
    onSuccess: (e) => {
      // Optionally return a context object to be passed to onSettled
      if (e?.serverError) {
        toast({
          title: "Error",
          description: e.serverError,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "Updated Company!",
        variant: "success",
      });
      // refetch all active queries partially matching a query key:
      queryClient.refetchQueries({ queryKey: ["company"], type: "active" });

      router.push(`/dashboard/courses/${course.id}`);
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof UpdateCourseSchema>>({
    resolver: zodResolver(UpdateCourseSchema),
    defaultValues: {
      id: course.id,
      data: {
        title: course.title,
        summary: course.summary || "",
        syllabuslink: course.syllabuslink || "",
      },
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof UpdateCourseSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    updateMutation.mutate(values);
  }
  return (
    <div>
      <div className="mx-auto my-8">
        <Link
          href={`/dashboard/courses/${course.id}`}
          className="inline-flex items-center gap-2"
          prefetch={false}
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Link>
        <h1 className="w-full text-center text-lg font-semibold">
          Edit Course {course.title}
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Theory of Computer Science"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Course&apos;s name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="This course is about..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Course&apos;s summary</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.syllabuslink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Syllabus Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/syllabus"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Link to the course&apos;s syllabus
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mr-2">
              Submit
            </Button>
            <Button type="reset" className="mr-2" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="button" variant="destructive" className="mr-2">
              Delete Course
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
