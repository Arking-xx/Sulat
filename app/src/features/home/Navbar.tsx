import { useEffect, useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import { HamburgerMenuIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import ProfileDropDown from '../../layout/ProfileDropDown';
import Notification from './Notification';
import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../../api/blogpost/blogApi';
import { useHideLayout } from '../../hooks/useHideLayout';

type NavbarProps = {
  toggleMenu?: () => void;
  button?: React.ReactNode;
};

function useDebounce<T>(value: T, delay: number) {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounceValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounceValue;
}

const Navbar: FC<NavbarProps> = ({ toggleMenu, button }: NavbarProps) => {
  const { hideElements } = useHideLayout();

  const [searchTerm, setSearchTerm] = useState('');
  const debounceSearch = useDebounce(searchTerm, 250);

  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'search', debounceSearch],
    queryFn: () => blogApi.searchTitle(debounceSearch),
    enabled: !!debounceSearch,
  });

  const searchTitle = data?.searchTitle?.map((post) => post.title) || [];

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
    <div className="">
      <nav className=" bg-primary z-50  flex items-center justify-between py-4 pb-5  fixed top-0 left-0 w-full sm:px-3 md:px-20 lg:px-20 ">
        <div className="flex items-center  gap-5 z-50">
          <div className="flex items-center pt-1 ml-2 ">
            {!hideElements && (
              <button onClick={toggleMenu} className="">
                <HamburgerMenuIcon className="size-6 cursor-pointer" />
              </button>
            )}
          </div>

          <Link onClick={scrollTop} to="/posts">
            <span className="font-semibold text-lg flex items-center  text-text-color">
              <span className="font-semibold font-lora text-3xl ">Sulat</span>
            </span>
          </Link>

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

            {searchTerm && searchTitle.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg p-2 z-50 max-h-64 overflow-y-scroll no-scrollbar">
                {data?.searchTitle.map((post) => (
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

        <div className=" flex items-center gap-2 sm:hidden md:flex lg:flex ">
          {!hideElements && (
            <div className="flex items-center gap-3 ">
              <div className=""></div>
              <div>
                <Notification />
              </div>

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
          {button}
          <ProfileDropDown />
        </div>

        <div className="lg:hidden md:hidden">
          <MagnifyingGlassIcon className="w-7 h-7 text-gray-500  " />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
