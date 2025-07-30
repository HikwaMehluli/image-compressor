"use client"

import * as React from "react"
import { Share2, Mail, Twitter, Facebook, Linkedin, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ShareMenu() {
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    // Correctly construct the URL for sharing, respecting the basePath
    const origin = window.location.origin;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    setUrl(`${origin}${basePath}`);
  }, []);

  const text = "Check out this awesome image compression tool!";
  
  const shareOptions = [
    { name: "Email", icon: Mail, url: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`},
    { name: "X (Twitter)", icon: Twitter, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`},
    { name: "Facebook", icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`},
    { name: "LinkedIn", icon: Linkedin, url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`},
    { name: "WhatsApp", icon: MessageCircle, url: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`},
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 size={20} />
          <span className="sr-only">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {shareOptions.map((option) => (
          <DropdownMenuItem key={option.name} asChild>
            <a href={option.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <option.icon size={16} className="w-4 h-4" />
              {option.name}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
