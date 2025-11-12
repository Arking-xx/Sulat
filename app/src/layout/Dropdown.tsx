import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { type FC } from 'react';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import Button from '../features/components/ui/Button';

type DropdownProps = {
  onDelete?: () => void;
  slug?: string | null;
};

const Dropdown: FC<DropdownProps> = ({ onDelete, slug }: DropdownProps) => {
  return (
    <div className="relative">
      <div className="absolute sm:-right-1 lg:right-4 -bottom-18">
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <Button className="cursor-pointer">
              <HamburgerMenuIcon className="size-6 " />
            </Button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className=" w-40 bg-white shadow-lg rounded-lg p-2 z-50 mr-2">
              <DropdownMenu.Item
                onClick={onDelete}
                className="flex items-center p-3 hover:bg-gray-50  rounded cursor-pointer focus:outline-none hover:border-1"
              >
                <Button className="">
                  <p>Delete</p>
                </Button>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
              <Link to={`/post/update/${slug}`}>
                <DropdownMenu.Item className="flex items-center p-3 hover:bg-gray-50 rounded focus:outline-none hover:border-1 cursor-pointer">
                  <Button className="font-roboto">Edit</Button>
                </DropdownMenu.Item>
              </Link>
              <DropdownMenu.Arrow className="fill-white stroke-gray-200 stroke-1" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};

export default Dropdown;
