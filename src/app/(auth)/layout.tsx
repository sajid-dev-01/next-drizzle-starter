import Link from "next/link";

import ThemeToggle from "@/components/ThemeToggle";

import Footer from "../(web)/_components/Footer";

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

const AuthLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <header className="flex h-14 items-center px-4 lg:px-6">
        <Link className="flex items-center justify-center" href="/">
          <MountainIcon className="size-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <div className="ml-auto flex">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex grow items-center justify-center p-10 ">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default AuthLayout;
