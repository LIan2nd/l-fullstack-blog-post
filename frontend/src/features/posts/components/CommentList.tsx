import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import type { Comment } from "../hooks/usePost";

interface CommentListProps {
  comments: Comment[];
  onDelete: (commentId: string) => void;
  loading: boolean;
}

export const CommentList = ({ comments, onDelete, loading }: CommentListProps) => {
  const { user } = useAuthStore();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        const isAuthor = user?._id === comment.author._id;

        return (
          <div key={comment._id} className="flex gap-3 p-4 border rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author.profilePic} alt={comment.author.name} />
              <AvatarFallback>{getInitials(comment.author.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground">@{comment.author.username}</span>
                <span className="text-xs text-muted-foreground">• {formattedDate}</span>
              </div>
              <p className="mt-1 text-sm">{comment.content}</p>
            </div>
            {isAuthor && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onDelete(comment._id)}
                disabled={loading}
              >
                <Trash2Icon className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};
