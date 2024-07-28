export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full bg-muted/40 min-h-screen flex-col">
      {children}
    </div>
  );
}
