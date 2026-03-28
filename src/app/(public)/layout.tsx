import Navbar from "@/components/custom/bar-sections/navbar";
import { createClient } from "@/lib/supabase-server";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar user={user} />
      {children}
    </>
  );
}
