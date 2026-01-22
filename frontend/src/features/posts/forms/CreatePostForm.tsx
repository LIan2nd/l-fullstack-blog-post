import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postFormSchema, type PostFormSchema } from "../forms/post";
import { useCreatePost } from "../hooks/useCreatePost";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { EyeIcon, PencilIcon } from "lucide-react";

export const CreatePostForm = () => {
  const { createPost, loading } = useCreatePost();
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const form = useForm<PostFormSchema>({
    defaultValues: {
      title: "",
      content: "",
    },
    resolver: zodResolver(postFormSchema),
  });

  const onSubmit = async (data: PostFormSchema) => {
    await createPost(data);
  };

  const content = form.watch("content");

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your post title"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <FieldLabel>Content (Markdown supported)</FieldLabel>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant={activeTab === "write" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("write")}
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Write
                </Button>
                <Button
                  type="button"
                  variant={activeTab === "preview" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("preview")}
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </div>
            </div>

            {activeTab === "write" ? (
              <Controller
                control={form.control}
                name="content"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Textarea
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Write your post content using Markdown..."
                      rows={12}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ) : (
              <div className="min-h-[300px] p-4 border rounded-md bg-muted/50">
                {content ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Nothing to preview yet. Start writing to see the preview.
                  </p>
                )}
              </div>
            )}
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
