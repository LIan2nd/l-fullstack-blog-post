import { useParams } from "react-router-dom";
import { usePost } from "../hooks/usePost";
import { useComments } from "../hooks/useComments";
import { useDeletePost } from "../hooks/useDeletePost";
import { CommentList } from "../components/CommentList";
import { CommentForm } from "../components/CommentForm";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2Icon, ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import ReactMarkdown from "react-markdown";
import type { CommentFormSchema } from "../forms/comment";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, refetch } = usePost(id);
  const { createComment, deleteComment, loading: commentLoading } = useComments(id);
  const { deletePost, loading: deleteLoading } = useDeletePost();
  const { user } = useAuthStore();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCommentSubmit = async (formData: CommentFormSchema) => {
    await createComment(formData);
    refetch();
  };

  const handleCommentDelete = async (commentId: string) => {
    await deleteComment(commentId);
    refetch();
  };

  const handleDeletePost = async () => {
    if (id && window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(id);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive">{error || "Post not found"}</p>
            <Link to="/">
              <Button variant="outline" className="mt-4">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  const { post, comments } = data;
  const isAuthor = user?._id === post.author._id;

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              {isAuthor && (
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={handleDeletePost}
                  disabled={deleteLoading}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </CardContent>
          <CardFooter className="flex items-center gap-3 border-t pt-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.profilePic} alt={post.author.name} />
              <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">@{post.author.username} • {formattedDate}</p>
            </div>
          </CardFooter>
        </Card>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>

          {user && (
            <div className="mb-6">
              <CommentForm onSubmit={handleCommentSubmit} loading={commentLoading} />
            </div>
          )}

          <CommentList
            comments={comments}
            onDelete={handleCommentDelete}
            loading={commentLoading}
          />
        </div>
      </main>
    </>
  );
}
