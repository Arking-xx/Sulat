import Modal from '../components/ui/Modal';
export default function HomePage() {
  return (
    <div className="fixed h-screen min-w-screen  flex sm:justify-center md:justify-start items-center overflow-hidden">
      <div className="flex flex-col gap-5 md:px-24">
        <div>
          <h1 className="font-lora sm:text-5xl md:text-8xl text-text-color font-medium ">
            Filipino
          </h1>
          <h2 className="font-lora sm:text-5xl md:text-6xl text-text-color font-medium">
            stories & ideas
          </h2>
          <div className="py-3 sm:w-80 md:w-lg">
            <h3 className="font-roboto sm:text-2xl  md:text-3xl text-text-color font-light">
              A place to share and enjoy Filipino stories and culture.
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
            className="text-sm cursor-pointer font-semibold text-white bg-black rounded-full py-4 px-7 "
          />
        </div>
      </div>
    </div>
  );
}
