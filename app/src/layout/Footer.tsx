export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full p-4 bg-primary border-t border-gray-200 shadow-sm md:flex md:items-center md:justify-between md:p-6 overflow-hidden">
      <span className="text-sm text-text-color sm:text-center ">
        © 2023{' '}
        <a href="sulat" className="hover:underline">
          Sulat
        </a>
        . All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-xs  font-roboto font-normal text-text-color sm:mt-0">
        <li>
          <a href="#" className="hover:underline me-4 md:me-6">
            About
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline me-4 md:me-6">
            Privacy Policy
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline me-4 md:me-6">
            Licensing
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </li>
      </ul>
    </footer>
  );
}
