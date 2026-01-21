import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigation = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <header className="flex items-center justify-between px-4 md:px-8 xl:px-60 py-2 xl:py-4">
      <h1 className="font-bold text-4xl">L's Blog Post</h1>
      {user ? (
        <Button onClick={logout}>Logout</Button>
      ) : (
        <Button onClick={() => navigation("/login")}>Login</Button>
      )}
    </header>
  )
}