import { useParams } from 'react-router-dom';

const Notfound = () => {
  let params = useParams();
  let unmatchPath = params['*'];

  return (
    <div className="bg-primary">
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="flex flex-col text-center text-gray-800">
          <h1 className="text-5xl font-lora">404</h1>
          <h2 className="text-3xl font-roboto  font-bold">OOOPS! {unmatchPath} NOT FOUND</h2>
          <div className="pt-5">
            <a
              href="/"
              className="text-sm cursor-pointer font-semibold text-white bg-black rounded-full px-4 py-2"
            >
              GO TO HOMEPAGE
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notfound;
