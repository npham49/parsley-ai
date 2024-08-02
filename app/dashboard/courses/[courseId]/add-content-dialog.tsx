"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { DocumentSchema } from "@/lib/zod-schemas/document";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addNewDocumentAction } from "./actions";
import { Loader } from "lucide-react";
import { matchYoutubeUrl } from "@/utils/helperFunctions";

export default function AddContentDialog({
  courseId,
  children,
}: {
  courseId: number;
  children: React.ReactNode;
}) {
  const mutation = useMutation({
    mutationFn: (formData: z.infer<typeof DocumentSchema>) =>
      addNewDocumentAction(formData),
    onError: (error) => {
      return alert(error.message || "Failed to updated");
    },
    onSuccess: (e) => {
      if (e?.serverError) {
        toast({
          title: "Error in creating course content",
          variant: "destructive",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              Error: {e.serverError}
            </pre>
          ),
        });
        return;
      }
      toast({
        title: "You submitted a new course content",
        variant: "default",
      });
      console.log(e?.data);
    },
  });

  const form = useForm<z.infer<typeof DocumentSchema>>({
    resolver: zodResolver(DocumentSchema),
    defaultValues: {
      courseId,
      type: undefined,
      youtubeUrl: "",
    },
  });

  function onSubmit(data: z.infer<typeof DocumentSchema>) {
    mutation.mutate(data);
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add new course content</DialogTitle>
            <DialogDescription>
              You can link a Youtube video, upload a file, or add a picture.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 pb-4">
            {mutation.isPending ? (
              <Loader />
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          What is the course content you&apos;re adding?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="youtube" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Youtube Video
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="file" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                File (PDF, Picture, Word)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("type") === "youtube" && (
                    <FormField
                      control={form.control}
                      name="youtubeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Youtube Link</FormLabel>
                          <FormControl>
                            <Input
                              className="w-full"
                              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This is the link to the YouTube Video
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {form.watch("type") === "youtube" &&
                    matchYoutubeUrl(form.watch("youtubeUrl") || "") && (
                      <div className="py-2 rounded-md">
                        <Label>Preview</Label>
                        <iframe
                          width="100%"
                          height="315"
                          src={`http://www.youtube.com/embed/${
                            form
                              .watch("youtubeUrl")
                              ?.split("watch?v=")[1]
                              .split("&")[0]
                          }?enablejsapi=1&origin=${window.location.origin}`}
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  {form.watch("youtubeUrl") && (
                    <Button type="submit">Process Video</Button>
                  )}
                </form>
              </Form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
