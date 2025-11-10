import { AnimatePresence, motion } from 'framer-motion';
import { PencilSquareIcon, UserIcon, HomeIcon } from '@heroicons/react/24/outline';
import Navbar from '../features/home/Navbar';
import { Link } from 'react-router-dom';
import { type FC, useState } from 'react';
import { useHideLayout } from '../hooks/useHideLayout';
import Notification from '../features/home/Notification';
import { useLogout } from '../hooks/useUtilityHook';
import Footer from './Footer';

const Sidebar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { _404, hideElements } = useHideLayout();
  const { handleLogout } = useLogout();

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
    <div className="">
      {!hideElements && (
        <div>
          <Navbar
            className={
              ' bg-primary z-50  flex items-center justify-between py-4 pb-5  fixed top-0 left-0 w-full sm:px-3 md:px-20 lg:px-20'
            }
            toggleMenu={() => toggleMenu()}
          />
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-opacity-50 z-10 lg:hidden sm:w-5 "
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
                className="pt-18  h-full fixed top-0 left-0 z-10  "
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
                      <div className="flex items-center justify-center">
                        <button onClick={handleLogout}>
                          <h2 className="text-red-400">Sign Out</h2>
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      <Notification />
    </div>
  );
};

export default Sidebar;
