import { useRef, useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useUserPosts } from "../hooks/useUserPosts";
import Header from "@/features/posts/components/Header";
import { PostCard } from "@/features/posts/components/PostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { CameraIcon, SaveIcon, Loader2Icon } from "lucide-react";

const API_BASE_URL = 'http://localhost:3000';

export default function ProfilePage() {
  const { profile, loading: profileLoading, refetch } = useProfile();
  const { updateProfile, loading: updateLoading } = useUpdateProfile();
  const { posts, loading: postsLoading } = useUserPosts(profile?._id);

  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize name when profile loads
  useState(() => {
    if (profile?.name && !name) {
      setName(profile.name);
    }
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: name !== profile?.name ? name : undefined,
        profilePic: selectedFile || undefined,
      });
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      refetch();
    } catch {
      // Error handled in hook
    }
  };

  const getProfilePicUrl = () => {
    if (previewUrl) return previewUrl;
    if (profile?.profilePic) {
      // Handle both relative and absolute URLs
      if (profile.profilePic.startsWith('http')) {
        return profile.profilePic;
      }
      return `${API_BASE_URL}${profile.profilePic}`;
    }
    return undefined;
  };

  if (profileLoading) {
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

  if (!profile) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load profile</p>
          </div>
        </main>
      </>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={getProfilePicUrl()} alt={profile.name} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CameraIcon className="h-4 w-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Click camera to change
                </p>
              </div>

              {/* Profile Info Section */}
              <div className="flex-1 space-y-4">
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    value={name || profile.name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setIsEditing(true);
                    }}
                    placeholder="Your name"
                  />
                </Field>

                <div>
                  <p className="text-sm font-medium mb-1">Username</p>
                  <p className="text-muted-foreground">@{profile.username}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Email</p>
                  <p className="text-muted-foreground">{profile.email}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Member since</p>
                  <p className="text-muted-foreground">{memberSince}</p>
                </div>

                {isEditing && (
                  <Button onClick={handleSave} disabled={updateLoading}>
                    {updateLoading ? (
                      <>
                        <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User's Posts Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Posts</h2>

          {postsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : posts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              You haven't created any posts yet.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
