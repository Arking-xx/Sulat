import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import { HamburgerMenuIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import ProfileDropDown from './ProfileDropDown';
import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../api/blogpost/blogApi';
import { useHideLayout } from '../hooks/useHideLayout';
import { useDebounce } from '../hooks/useUtilityHook';
import Button from '../features/components/ui/Button';
import Modal from '../features/components/ui/Modal';

type NavbarProps = {
  toggleMenu?: () => void;
  button?: React.ReactNode;
  className: string;
};

const Navbar: FC<NavbarProps> = ({ toggleMenu, button, className }: NavbarProps) => {
  const { hideElements, hideInHomePage, redirect } = useHideLayout();

  const [searchTerm, setSearchTerm] = useState('');
  const debounceSearch = useDebounce(searchTerm, 250);

  const { data } = useQuery({
    queryKey: ['posts', 'search', debounceSearch],
    queryFn: () => blogApi.searchTitle(debounceSearch),
    enabled: !!debounceSearch,
  });

  const searchTitle = data?.blogpost?.map((post) => post.title) || [];

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <nav className={className}>
      <div className="flex items-center gap-5">
        <div className="flex items-center pt-1 ml-2">
          {!hideElements && !hideInHomePage && (
            <Button onClick={toggleMenu} className="">
              <HamburgerMenuIcon className="size-6 cursor-pointer" />
            </Button>
          )}
        </div>

        <Link to={redirect ? '/posts' : '/'}>
          <span
            onClick={scrollTop}
            className="font-semibold text-lg flex items-center  text-text-color"
          >
            <span className="font-semibold font-lora text-3xl ">Sulat</span>
          </span>
        </Link>

        {!hideInHomePage && (
          <div className="desktop-only sm:hidden md:flex relative">
            <div className="flex items-center bg-white rounded-full h-10 px-3      ">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 mr-2 " />
              <input
                value={searchTerm}
                onChange={handleChangeTitle}
                type="text"
                placeholder="Search title..."
                className="flex-1 bg-transparent outline-none text-sm font-medium"
              />
            </div>

            <div>
              {searchTerm && searchTitle.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg p-2 z-50 max-h-64 overflow-y-scroll no-scrollbar">
                  {data?.blogpost?.map((post) => (
                    <Link
                      key={post._id}
                      to={`/post/${post.slug}`}
                      className="block p-3 hover:bg-gray-50 rounded cursor-pointer text-sm"
                      onClick={() => setSearchTerm('')}
                    >
                      <p>Author: {post.author.username}</p>
                      {post.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className=" flex items-center gap-2 sm:hidden md:flex lg:flex ">
        {!hideElements && !hideInHomePage && (
          <div className="flex items-center gap-3 ">
            <div className=""></div>

            <Link to="/write">
              <div className="group flex items-center   gap-1 mr-2 cursor-pointer">
                <PencilSquareIcon className="group-hover:text-gray-800 w-6 mb-1 font-medium  text-gray-500 stroke-1  " />
                <h2 className="group-hover:text-gray-800 text-[15px] text-gray-500 font-roboto">
                  Write
                </h2>
              </div>
            </Link>
          </div>
        )}

        {hideInHomePage && (
          <div className=" flex items-center gap-8 text-text-color sm:hidden md:flex">
            <div className="flex items-center gap-5">
              <Link to="/" className="py-1 px-3 text-sm font-roboto font-normal">
                About
              </Link>
              <Link to="/about" className="py-1 px-3 text-sm font-roboto font-normal">
                Share Story
              </Link>
              <div className="py-1 px-3 text-sm font-roboto font-normal">
                <Modal
                  signgupText="Sign up"
                  signinText="Sign in"
                  googleSignup="Sign up with Google"
                  heading="Join Sulat."
                  title="Write"
                />
              </div>
              <div className="py-1 px-3 text-sm font-roboto font-normal">
                <Modal
                  signgupText="Sign up"
                  signinText="Sign in"
                  googleSignup="Sign up with Google"
                  heading="Join Sulat."
                  title="Sign in"
                />
              </div>
            </div>
            <Modal
              signgupText="Sign up"
              signinText="Sign in"
              googleSignup="Sign up with Google"
              heading="Join Sulat."
              title="Get started"
              className="text-sm cursor-pointer font-semibold text-white bg-black rounded-full px-4 py-2"
            />
          </div>
        )}

        {button}
        {!hideInHomePage && <ProfileDropDown />}
      </div>

      {!hideInHomePage && (
        <div className="lg:hidden md:hidden py-1">
          <div className="flex bg-white rounded-full h-10 focus:rounded-b-full">
            <input
              value={searchTerm}
              onChange={handleChangeTitle}
              type="text"
              placeholder="Search title..."
              className="flex-1 bg-transparent outline-none text-sm font-medium ml-2"
            />
          </div>
          {searchTerm && searchTitle.length > 0 && (
            <div className="absolute top-full  w-full bg-white shadow-lg rounded-lg z-50 max-h-64 overflow-y-scroll no-scrollbar">
              {data?.blogpost?.map((post) => (
                <Link
                  key={post._id}
                  to={`/post/${post.slug}`}
                  className="block p-3 hover:bg-gray-50 rounded cursor-pointer text-sm"
                  onClick={() => setSearchTerm('')}
                >
                  <p>Author: {post.author.username}</p>
                  {post.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
