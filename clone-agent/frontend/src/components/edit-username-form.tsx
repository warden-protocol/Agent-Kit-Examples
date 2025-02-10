import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { toast } from "sonner";
import useChatStore from "@/lib/hooks/use-chat-store";
import { useAppKitAccount } from "@reown/appkit/react";
import { Loader2, CopyIcon, Eye, EyeOff, CheckIcon, Wallet } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

interface WalletDetails {
  publicKey: string;
  privateKey: string;
  seedPhrase: string;
  createdAt: string;
}

interface EditUsernameFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditUsernameForm({ setOpen }: EditUsernameFormProps) {
  const userName = useChatStore((state) => state.userName);
  const setUserName = useChatStore((state) => state.setUserName);
  const accountDetails = useAppKitAccount();
  // const accountDetails = {
  //   address: "0x1234567890123456789012345678901234567890",
  // };
  
  const [walletDetails, setWalletDetails] = useState<WalletDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [copiedStates, setCopiedStates] = useState({
    publicKey: false,
    privateKey: false,
    seedPhrase: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: userName,
    },
  });

  useEffect(() => {
    if (accountDetails.address) {
      fetchWalletDetails();
    }
  }, []);

  const fetchWalletDetails = async () => {
    if (!accountDetails.address) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/wallet/${accountDetails.address}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch wallet details');
      }
      
      const data = await response.json();
      setWalletDetails(data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch wallet details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, field: keyof typeof copiedStates) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [field]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [field]: false }));
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setUserName(values.username);
    toast.success("Name updated successfully");
  }

  if (!accountDetails.address) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8">
        <div className="p-3 rounded-full bg-muted">
          <Wallet className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm">
          Please connect your wallet to view settings
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="w-full flex flex-col gap-4 pt-4">
        <FormLabel className="text-lg font-semibold">Wallet Details</FormLabel>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-red-500 py-2">{error}</div>
        ) : walletDetails ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <FormLabel className="text-sm">Public Key</FormLabel>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={walletDetails.publicKey}
                  className="font-mono text-sm cursor-text"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleCopy(walletDetails.publicKey, 'publicKey')}
                  className="cursor-pointer"
                >
                  {copiedStates.publicKey ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm">Private Key</FormLabel>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="cursor-pointer"
                >
                  {showPrivateKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  type={showPrivateKey ? "text" : "password"}
                  readOnly
                  value={walletDetails.privateKey}
                  className="font-mono text-sm cursor-text"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleCopy(walletDetails.privateKey, 'privateKey')}
                  className="cursor-pointer"
                >
                  {copiedStates.privateKey ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm">Seed Phrase</FormLabel>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                  className="cursor-pointer"
                >
                  {showSeedPhrase ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  type={showSeedPhrase ? "text" : "password"}
                  readOnly
                  value={walletDetails.seedPhrase}
                  className="font-mono text-sm cursor-text"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleCopy(walletDetails.seedPhrase, 'seedPhrase')}
                  className="cursor-pointer"
                >
                  {copiedStates.seedPhrase ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Created: {new Date(walletDetails.createdAt).toLocaleDateString()}
            </div>
          </div>
        ) : null}
      </div>

      <div className="w-full flex flex-col gap-4 pt-4">
        <FormLabel>Theme</FormLabel>
        <div className="cursor-pointer">
          <ModeToggle />
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <div className="md:flex gap-4">
                  <Input {...field} type="text" placeholder="Enter your name" className="cursor-text" />
                  <Button type="submit" className="cursor-pointer">Change name</Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}