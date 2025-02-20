import Footer from "@/components/footer";
import Header from "@/components/header";

type Props = {
  children: React.ReactNode;
};

export default async function AuthLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main className="flex grow flex-col items-center justify-center gap-8 p-4 ">
        {children}
      </main>
      <Footer />
    </>
  );
}
