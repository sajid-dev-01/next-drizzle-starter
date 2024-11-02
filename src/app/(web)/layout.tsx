import React from "react";

import AuthContext from "@/context/AuthContext";
import { validateRequest } from "@/lib/auth";

import Footer from "./_components/Footer";
import Header from "./_components/Header";

type Props = {
  children: React.ReactNode;
};

const WebLayout: React.FC<Props> = async ({ children }) => {
  const { session, user } = await validateRequest();

  return (
    <AuthContext session={session} user={user}>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        {children}
        <Footer />
      </div>
    </AuthContext>
  );
};

export default WebLayout;
