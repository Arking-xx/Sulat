import * as Dialog from '@radix-ui/react-dialog';
import Button from './Button';

type Props = {
  title?: string;
  heading?: string;
  signgupText?: string;
  signinText?: string;
  className?: string;
  googleSignup?: string;
};

export default function Modal(props: Props) {
  const RETURN_URL = import.meta.env.VITE_RETURN_URL;
  const handleGoogleLogin = () => {
    const returnUrl = `${window.location.origin}/posts`;
    const authUrl = `${RETURN_URL}${encodeURIComponent(returnUrl)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="z-50">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button className={props.className}>{props.title}</Button>
        </Dialog.Trigger>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow " />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md focus:outline-none shadow-lg max-w-md w-full data-[state=open]:animate-contentShow ">
          <Dialog.Title className="flex justify-center py-6 font-lora text-2xl">
            {props.heading}
          </Dialog.Title>
          <Dialog.Description></Dialog.Description>
          <div className="flex justify-center mb-1">
            <a
              onClick={handleGoogleLogin}
              className="border border-r-black rounded-full px-4 py-3 cursor-pointer"
            >
              <div className="flex gap-2">
                <img src="/google-color-icon.svg" width={30} height={30} alt="" />
                <p className="mt-1">{props.googleSignup}</p>
              </div>
            </a>
          </div>
          <div className="flex justify-center items-center py-6">
            Already have an account?&nbsp;
            <a href="/signin" className="underline text-text-color">
              {props.signinText}
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
