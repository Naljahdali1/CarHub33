import React from 'react';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactButtons({ phone, className }) {
  const handleCall = () => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${phone?.replace(/\D/g, '')}`, '_blank');
  };

  const handleEmail = () => {
    // This would open email or a contact form
    window.location.href = `mailto:info@example.com?subject=Inquiry about vehicle`;
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <Button
        onClick={handleCall}
        className="flex-1 h-14 bg-[#FF5F2D] hover:bg-[#FF5F2D]/90 text-white font-semibold rounded-xl"
      >
        <Phone className="w-5 h-5 mr-2" />
        Call Seller
      </Button>
      <Button
        onClick={handleWhatsApp}
        variant="outline"
        className="flex-1 h-14 border-[#2A2A2D] text-white hover:bg-[#2A2A2D] rounded-xl"
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        WhatsApp
      </Button>
      <Button
        onClick={handleEmail}
        variant="outline"
        className="flex-1 h-14 border-[#2A2A2D] text-white hover:bg-[#2A2A2D] rounded-xl"
      >
        <Mail className="w-5 h-5 mr-2" />
        Message
      </Button>
    </div>
  );
}