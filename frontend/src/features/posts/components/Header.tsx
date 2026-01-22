import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { UserIcon } from "lucide-react";

export default function Header() {
  const navigation = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <header className="flex items-center justify-between px-4 md:px-8 xl:px-60 py-2 xl:py-4 border-b">
      <Link to="/">
        <h1 className="font-bold text-2xl md:text-4xl hover:text-primary transition-colors">
          L's Blog Post
        </h1>
      </Link>
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                <UserIcon className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <Button onClick={() => navigation("/login")}>Login</Button>
        )}
      </div>
    </header>
  )
}