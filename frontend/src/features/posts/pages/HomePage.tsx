import { useState } from "react";
import Header from "../components/Header";
import { PostList } from "../components/PostList";
import { SearchInput } from "../components/SearchInput";
import { Pagination } from "../components/Pagination";
import { usePosts } from "../hooks/usePosts";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { posts, loading, error, totalPages, currentPage, totalPosts } = usePosts({
    search,
    page,
    limit: 6
  });

  const { user } = useAuthStore();

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Latest Posts</h1>
            {!loading && (
              <p className="text-sm text-muted-foreground mt-1">
                {totalPosts} {totalPosts === 1 ? "post" : "posts"} found
              </p>
            )}
          </div>
          {user && (
            <Link to="/posts/new">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
          )}
        </div>

        <div className="mb-6 max-w-md">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search posts by title or content..."
          />
        </div>

        <PostList posts={posts} loading={loading} error={error} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>
    </>
  );
}