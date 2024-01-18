export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className={"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}
    >
      {children}
    </main>
  );
}
