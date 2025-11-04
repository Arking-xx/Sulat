import Modal from '../features/ui/Modal';
import { Link } from 'react-router-dom';
function Navbar() {
  return (
    <>
      <nav className="absolute bg-primary shadow-lg flex items-center justify-between py-3 px-32  top-0 left-0 w-full ">
        <Link to="/">
          <span className="font-semibold font-lora text-2xl text-text-color">Sulat</span>
        </Link>

        <div className=" flex items-center gap-8 text-text-color">
          <div className="flex items-center gap-5">
            <Link to="/" className="py-1 px-3 text-sm font-roboto font-normal">
              About
            </Link>
            <Link to="/about" className="py-1 px-3 text-sm font-roboto font-normal">
              Share Story
            </Link>
            <Link to="/contact" className="py-1 px-3 text-sm font-roboto font-normal">
              Write
            </Link>
            <Link to="/product" className="py-1 px-3 text-sm font-roboto font-normal">
              Sign In
            </Link>
          </div>
          <Modal
            signgupText="Sign up"
            signinText="Sign in"
            heading="Join Sulat."
            title="Get started"
            className=" text-sm cursor-pointer font-semibold text-white bg-black rounded-full px-4 py-2 "
          />
        </div>
      </nav>
    </>
  );
}

export default Navbar;
