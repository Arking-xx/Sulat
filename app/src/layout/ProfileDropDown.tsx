import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';

export default function ProfileDropDown() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const username = user?.username;
  const capitalizeFirstLetter = (users: string | undefined) => {
    if (!users) return ' ';

    return users.charAt(0).toUpperCase() + users.slice(1);
  };

  const profileImage = user?.images?.[0]?.url;
  ('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.log('failed to logout', error);
    }
  };

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className="cursor-pointer">
          <img
            src={profileImage}
            alt="Profile"
            className="rounded-full w-10 h-10 hover:border-1 object-cover"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="w-40 bg-white shadow-lg rounded-lg p-2 z-50 mr-2">
          <Link to="/profile">
            <DropdownMenu.Item className="overflow-hidden flex items-center p-3 hover:bg-gray-50  rounded cursor-pointer focus:outline-none hover:border-1">
              <img
                src={profileImage}
                alt="Profile"
                className="rounded-full w-12 h-12 object-cover mr-3"
              />
              <div>
                <h2 className="font-roboto font-medium">{capitalizeFirstLetter(username)}</h2>
                <p className="text-xs text-gray-500 font-roboto pl-1">View Profile</p>
              </div>
            </DropdownMenu.Item>
          </Link>

          <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
          <DropdownMenu.Item
            onClick={handleLogout}
            className="flex items-center p-3 hover:bg-gray-50 rounded focus:outline-none hover:border-1 cursor-pointer"
          >
            <button className="font-roboto">Sign Out</button>
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className="fill-white stroke-gray-200 stroke-1" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
