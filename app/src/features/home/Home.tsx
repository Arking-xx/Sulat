import Modal from '../components/ui/Modal';
export default function Home() {
  return (
    <div className="fixed  h-150 min-w-screen  flex justify-start items-center pl-48 ">
      <div className="flex flex-col max-w-3xl gap-5   ">
        <h1 className="font-lora text-8xl text-text-color font-medium ">Filipino</h1>
        <h2 className="font-lora text-6xl text-text-color font-medium">stories & ideas</h2>
        <div className="py-3">
          <h3 className="font-roboto text-3xl text-text-color font-light">
            A place to share and enjoy Filipino stories and culture.
          </h3>
        </div>
        <div>
          <Modal
            title="Start reading"
            heading="Join Sulat."
            signgupText="Sign up"
            signinText="Sign in"
            className="text-sm cursor-pointer font-semibold text-white bg-black rounded-full py-4 px-7 "
          />
        </div>
      </div>
    </div>
  );
}
