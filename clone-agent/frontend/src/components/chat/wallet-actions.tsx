import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';

const WalletActions = ({ address, onSend }: any) => {
  const [isCopied, setIsCopied] = useState(false);
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setIsCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!amount || !recipientAddress) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsProcessing(true);
    try {
      await onSend(recipientAddress, amount);
      toast.success('Transaction sent successfully');
      setAmount('');
      setRecipientAddress('');
    } catch (error: any) {
      toast.error('Transaction failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-6">
      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send" className="flex items-center gap-2">
            <SendIcon className="w-4 h-4" />
            Send
          </TabsTrigger>
          <TabsTrigger value="receive" className="flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            Receive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="mt-4">
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ETH)</Label>
              <Input
                id="amount"
                type="number"
                step="0.0001"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">◌</span>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <SendIcon className="w-4 h-4" />
                  Send Transaction
                </span>
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="receive" className="mt-4">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg">
                <QRCodeSVG 
                  value={address} 
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Wallet Address</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={address}
                  className="font-mono text-sm"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopy}
                >
                  {isCopied ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletActions;