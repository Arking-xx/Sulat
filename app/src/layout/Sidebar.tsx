import { AnimatePresence, motion } from 'framer-motion';
import {
  PencilSquareIcon,
  UserIcon,
  HomeIcon,
  BookOpenIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import Navbar from '../features/home/Navbar';
import { Link } from 'react-router-dom';
import { type FC, useState } from 'react';
import { useHideLayout } from '../hooks/useHideLayout';

const Sidebar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { hideElements } = useHideLayout();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      toggleMenu();
      return;
    }
  };

  return (
    <div>
      {!hideElements && (
        <div>
          <Navbar toggleMenu={() => toggleMenu()} />
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-opacity-50 z-30 lg:hidden sm:w-5 "
                onClick={toggleMenu}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                key="sidebar"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="pt-18  h-full fixed top-0 left-0 z-30  "
              >
                <div className="border-r border-gray-200 pr-5 h-full shadow-sm bg-white z-20  w-[300px]   ">
                  <ul className="py-10 sm:ml-8 lg:ml-11 px-9 text-text-color --font-lora text-[20px]   ">
                    <li className="p-2 ">
                      <Link
                        to="/posts"
                        className="hover:underline decoration-1"
                        onClick={() => closeSidebar()}
                      >
                        <div className="flex items-center ">
                          <HomeIcon className="w-6 mr-5" />
                          <h2>Home</h2>
                        </div>
                      </Link>
                    </li>
                    <li className="p-2">
                      <a href="" className="hover:underline decoration-1">
                        <div className="flex items-center">
                          <BookOpenIcon className="w-6 mr-5 " />
                          <h2>Library</h2>
                        </div>
                      </a>
                    </li>
                    <li className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => closeSidebar()}
                        className="hover:underline decoration-1 "
                      >
                        <div className="flex items-center">
                          <UserIcon className="w-6 mr-5 " />
                          <h2>Profile</h2>
                        </div>
                      </Link>
                    </li>
                    <li className="p-2">
                      <a href="" className="hover:underline decoration-1">
                        <div className="flex items-center">
                          <UsersIcon className="w-6 mr-5" />
                          <h2>Following</h2>
                        </div>
                      </a>
                    </li>

                    <li className="p-2 lg:hidden md:hidden">
                      <Link
                        onClick={() => closeSidebar()}
                        to="/write"
                        className="hover:underline decoration-1"
                      >
                        <div className="flex items-center">
                          <PencilSquareIcon className="group-hover:text-gray-800 w-6 mr-5    " />
                          <h2>Write</h2>
                        </div>
                      </Link>
                    </li>

                    <li className="py-2  border-t  border-gray-400 mt-5 lg:hidden md:hidden">
                      <Link to="/write" className="hover:underline decoration-1">
                        <div className="flex items-center justify-center">
                          <h2 className="text-red-400">Sign Out</h2>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
