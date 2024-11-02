import { redirect } from "next/navigation";

import { AUTH_URI } from "@/constants";
import AuthContext from "@/context/AuthContext";
import { validateRequest } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
};

const DashboardPageLayout: React.FC<Props> = async ({ children }) => {
  const { session, user } = await validateRequest();

  if (!session) return redirect(AUTH_URI.signIn);

  return (
    <AuthContext session={session} user={user}>
      {children}
    </AuthContext>
  );
};

export default DashboardPageLayout;
