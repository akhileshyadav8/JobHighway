"use client";

import { Copy, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  jobTitle: string;
  jobUrl: string;
}

export function ShareButtons({ jobTitle, jobUrl }: ShareButtonsProps) {
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${jobUrl}` : '';
  const text = `Check out this job: ${jobTitle}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${text}\n${fullUrl}`);
    // Ideally add a toast here
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + fullUrl)}`, '_blank');
  };

  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex flex-wrap gap-2.5 sm:gap-3">
      <Button 
        onClick={handleWhatsApp}
        className="bg-[#25D366] hover:bg-[#128C7E] text-white flex-1 sm:flex-none min-w-[110px] sm:min-w-[130px]"
      >
        <MessageCircle className="w-4 h-4 mr-1.5" />
        WhatsApp
      </Button>
      <Button 
        onClick={handleTelegram}
        className="bg-[#0088cc] hover:bg-[#0077b5] text-white flex-1 sm:flex-none min-w-[110px] sm:min-w-[130px]"
      >
        <Send className="w-4 h-4 mr-1.5" />
        Telegram
      </Button>
      <Button 
        onClick={handleCopy}
        variant="outline"
        className="flex-1 sm:flex-none min-w-[110px] sm:min-w-[130px]"
      >
        <Copy className="w-4 h-4 mr-1.5" />
        Copy Link
      </Button>
    </div>
  );
}
