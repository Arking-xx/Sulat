import Home from './features/home/Home';
import SignUp from './features/auth/SignUp';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import SignIn from './features/auth/SignIn';
import Sidebar from './layout/Sidebar.tsx';
import WriteArticle from './layout/WriteArticle';
import UserProfile from './layout/UserProfile';
import VisitUserProfile from './layout/VisitUserProfile.tsx';
import Post from './features/home/Post.tsx';
import EditProfile from './layout/EditProfile.tsx';
import EditPost from './layout/EditPost.tsx';

import UserLandingPage from './features/home/UserLandingPage';
import { Routes, Route } from 'react-router-dom';

import { useComponent, ProtectedRoutes } from './features/ui/useComponent';

function App() {
  const { hideLayout, hideSidebar } = useComponent();
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

          <Route element={<ProtectedRoutes />}>
            <Route path="/write" element={<WriteArticle />} />
            <Route path="/post/:slug" element={<Post />} />
            <Route path="/posts" element={<UserLandingPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/updateprofile" element={<EditProfile />} />
            <Route path="/profile/user/:id" element={<VisitUserProfile />} />
            <Route path="/post/update/:slug" element={<EditPost />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
