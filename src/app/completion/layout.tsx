import CustomCircleProgress from "./_components/CircleProgress";
import Progress from "./_components/Progress";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-screen h-screen relative">
      <div className="w-full min-h-14 h-14 sticky top-0 bg-white z-10">
        <div className="w-full flex h-full justify-between items-center px-12">
          <CustomCircleProgress />
          <span className="font-semibold text-2xl">SCAMPER</span>
        </div>

        <Progress />
      </div>

      {children}
    </div>
  );
}
