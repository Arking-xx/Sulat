import Modal from '../components/ui/Modal';
import { useHideLayout } from '../../hooks/useHideLayout';
import Footer from '../../layout/Footer';
import Navbar from '../../layout/Navbar';

export default function HomePage() {
  const { hideLayout } = useHideLayout();
  return (
    <div className="">
      {!hideLayout && (
        <Navbar
          className={
            'sticky z-10 bg-primary shadow-lg flex items-center justify-between py-3 md:px-18 top-0 left-0 w-full'
          }
        />
      )}
      <div className=" h-screen flex sm:justify-center md:justify-start mt-30 ">
        <div className="flex flex-col gap-5 sm:px-5 md:px-24  w-screen overflow-hidden">
          <div>
            <h1 className="font-lora sm:text-5xl md:text-8xl text-text-color font-medium ">
              Filipino
            </h1>
            <h2 className="font-lora sm:text-5xl md:text-6xl text-text-color font-medium">
              stories & ideas
            </h2>
            <div className="py-3 sm:w-80 md:w-lg">
              <h3 className="font-roboto sm:text-2xl  md:text-3xl text-text-color font-light">
                A place to share and enjoy Filipino stories.
              </h3>
            </div>
          </div>
          <div>
            <Modal
              title="Start reading"
              heading="Join Sulat."
              signgupText="Sign up"
              googleSignup="Sign up with Google"
              signinText="Sign in"
              className="text-sm cursor-pointer font-semibold text-white bg-black rounded-full py-4 px-7"
            />
          </div>
        </div>
      </div>

      <div id="about" className="flex items-center sm:mx-10 md:mx-24 h-50 sm:mt-10 md:mt-0">
        <section className="">
          <div className="grid grid-cols-2 gap-10">
            <h2 className="font-lora sm:text-xl md:text-5xl sm:bg-gray-400 sm:text-white md:text-black md:bg-white h-fit">
              Every Filipino has a story waiting to be heard.
            </h2>
            <p className="font-lora text-justify sm:text-sm md:text-xl mt-20 sm:mb-20 md:mb-50">
              Sulat is a website where every Filipino can share their daily stories and ideas.
              Anyone can share their knowledge with people on the internet. This platform isn’t just
              about learning — it’s also a place to meet new people. My ultimate goal in creating
              Sulat is to help Filipinos connect with others and discover different cultures across
              the Philippines.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
