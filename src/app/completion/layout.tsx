import Progress from "./_components/Progress";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="w-full min-h-14 h-14">
        <div className="w-full flex h-full justify-between items-center px-12">
          <div />
          <span className="font-semibold text-2xl">SCAMPER</span>
        </div>

        <Progress />
      </div>

      {children}
    </div>
  );
}
