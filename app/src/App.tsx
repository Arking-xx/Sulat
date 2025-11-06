import Home from './features/home/Home';
import SignUp from './features/auth/SignUp';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import SignIn from './features/auth/SignIn';
import Sidebar from './layout/Sidebar.tsx';
import Post from './features/home/Post.tsx';
import CreatePost from './features/posts/CreatePost.tsx';
import CurrentUserProfile from './features/profile/CurrentUserProfle.tsx';
import OtherUserProfile from './features/profile/OtherUserProfile.tsx';
import EditProfile from './features/profile/EditProfile.tsx';
import EditPost from './features/posts/EditPost.tsx';
import UserLandingPage from './features/home/UserLandingPage';
import { Routes, Route } from 'react-router-dom';

import { AuthRouteGuard } from './features/auth/AuthRouteGuard.tsx';
import { useHideLayout } from './hooks/useHideLayout.tsx';

function App() {
  const { hideLayout, hideSidebar } = useHideLayout();
  return (
    <>
      <div className="">
        {!hideLayout && <Navbar />}
        {!hideLayout && <Footer />}
        {!hideSidebar && <Sidebar />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          <Route element={<AuthRouteGuard />}>
            <Route path="/write" element={<CreatePost />} />
            <Route path="/post/:slug" element={<Post />} />
            <Route path="/posts" element={<UserLandingPage />} />
            <Route path="/profile" element={<CurrentUserProfile />} />
            <Route path="/profile/updateprofile" element={<EditProfile />} />
            <Route path="/profile/user/:id" element={<OtherUserProfile />} />
            <Route path="/post/update/:slug" element={<EditPost />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
