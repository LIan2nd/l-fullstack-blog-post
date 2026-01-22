import Header from "../components/Header";
import { CreatePostForm } from "../forms/CreatePostForm";

export default function CreatePostPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CreatePostForm />
      </main>
    </>
  );
}
