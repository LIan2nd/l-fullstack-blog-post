import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import type { Post } from "../hooks/usePosts";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getProfilePicUrl = (path: string | undefined) => {
    if (!path) return undefined;
    return path.startsWith("http") ? path : `${apiUrl}${path}`;
  };

  const previewContent = post.content.length > 200
    ? post.content.substring(0, 200) + "..."
    : post.content;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <Link to={`/posts/${post._id}`}>
          <CardTitle className="hover:text-primary transition-colors cursor-pointer line-clamp-2">
            {post.title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground line-clamp-3 prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{previewContent}</ReactMarkdown>
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={getProfilePicUrl(post.author.profilePic)}
            alt={post.author.name}
          />
          <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium">{post.author.name}</p>
          <p className="text-xs text-muted-foreground">@{post.author.username}</p>
        </div>
        <p className="text-xs text-muted-foreground">{formattedDate}</p>
      </CardFooter>
    </Card>
  );
};