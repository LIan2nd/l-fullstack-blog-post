import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function AuthCardHeader({ title, description }: { title: string, description: string }) {
  const navigate = useNavigate()

  return (
    <CardHeader>
      <h1 className="font-bold text-2xl hover:cursor-pointer mb-4 text-center" onClick={() => navigate("/")}>L's Blog Post</h1>
      <CardTitle>{title}</CardTitle>
      <CardDescription>
        {description}
      </CardDescription>
    </CardHeader>
  )
}