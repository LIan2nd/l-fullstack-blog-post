// Dependencies Imports
import { Routes, Route } from 'react-router-dom';

// Layouts Imports
import AuthLayout from "./features/auth/layout/main";
import MainLayout from "./features/posts/layout/main";

// Pages Imports
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from './features/auth/pages/RegisterPage';
import GuestGuard from './middleware/guestGuard';
import AuthGuard from './middleware/authGuard';
import HomePage from './features/posts/pages/HomePage';
import PostDetailPage from './features/posts/pages/PostDetailPage';
import CreatePostPage from './features/posts/pages/CreatePostPage';
import ProfilePage from './features/profile/pages/ProfilePage';

function App() {

  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route element={<GuestGuard />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Main App Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<AuthGuard />}>
          <Route element={<MainLayout />}>
            <Route path="/posts/new" element={<CreatePostPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
