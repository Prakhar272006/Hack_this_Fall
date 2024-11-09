import AssetManagement from '@/components/AssetManagement';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="absolute top-0 left-0 w-full">
        <Navbar />
      </div>
      <AssetManagement />
    </main>
  );
}