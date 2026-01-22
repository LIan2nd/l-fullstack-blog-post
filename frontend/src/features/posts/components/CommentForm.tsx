import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentFormSchema, type CommentFormSchema } from "../forms/comment";
import { Field, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";

interface CommentFormProps {
  onSubmit: (data: CommentFormSchema) => Promise<void>;
  loading: boolean;
}

export const CommentForm = ({ onSubmit, loading }: CommentFormProps) => {
  const form = useForm<CommentFormSchema>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(commentFormSchema),
  });

  const handleSubmit = async (data: CommentFormSchema) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(handleSubmit)}>
      <Controller
        control={form.control}
        name="content"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Textarea
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Write a comment..."
              rows={3}
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading} size="sm">
          <SendIcon className="h-4 w-4 mr-2" />
          {loading ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
};
