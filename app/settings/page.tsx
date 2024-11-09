"use client"
import React, { useEffect } from 'react';
import { Loader2 } from "lucide-react";
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

interface SettingsSchema {
  email: string;
  image: string;
  name: string;
  username: string;
}

const Settings = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = React.useState<SettingsSchema>({
    email: "example@example.com",
    image: "https://example.com/avatar.png",
    name: "Example user",
    username: "example"
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingToastId, setLoadingToastId] = React.useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    } else {
      fetch("/api/settings").then(res => res.json()).then(setData)
    }
  }, [status, router]);

  const submitData = () => {
    setIsLoading(true);
    const toastId = toast.loading("Updating settings...");
    setLoadingToastId(toastId);

    fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(res => {
      if (res.ok) {
        setIsLoading(false);
        toast.dismiss(toastId);
        toast.success("Settings updated successfully");
      } else {
        toast.error("Failed to update settings");
      }
    }).catch(() => {
      setIsLoading(false);
      toast.dismiss(toastId);
      toast.error("Network error");
    });
  }

  if (status === "loading" || status === "unauthenticated") {
    return <div className='min-h-screen flex justify-center items-center'><Loader2 className="mr-2 h-4 w-4 animate-spin" /></div>;
  }

  return (
    <div className="w-full min-h-screen max-w-md mx-auto p-3">
      <div className="absolute top-0 left-0 w-full">
        <Navbar />
      </div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <div className="flex flex-col items-center space-y-6 py-8 pt-20">
        <div className="flex flex-col items-center space-y-2">
          <Label htmlFor="Avatar">Profile Image</Label>
          <Avatar className="w-20 h-20">
            <AvatarImage src={data.image} />
            <AvatarFallback>Ani</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Enter your username" value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-700 px-4 py-6 flex justify-between items-center">
        <Button className="w-full text-white mr-2 bg-zinc-900 hover:bg-zinc-700 border-zinc-900" onClick={submitData}>Save Changes</Button>
        <Button className="w-full ml-2 text-white bg-zinc-900 hover:bg-zinc-700 border-zinc-900" onClick={() => signOut()}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Settings;