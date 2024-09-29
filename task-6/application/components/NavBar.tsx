import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          <Link href="/">MyApp</Link>
        </div>
        <div className="space-x-4 flex items-center justify-center">
          <Link href="/">
            <p className="text-gray-300 hover:text-white transition duration-200">
              Home
            </p>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
