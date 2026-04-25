import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function getEmbedUrl(url: string): string {
  if (!url) return '';
  
  try {
    // Extract YouTube ID
    let videoId = '';
    
    // Check for youtu.be/xxxx
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } 
    // Check for youtube.com/watch?v=xxxx
    else if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v') || '';
    }
    // Check for youtube.com/embed/xxxx
    else if (url.includes('youtube.com/embed/')) {
      return url; // Already an embed URL
    }
    // Check for youtube.com/shorts/xxxx
    else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('youtube.com/shorts/')[1].split('?')[0];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo
    if (url.includes('vimeo.com/')) {
      if (url.includes('player.vimeo.com')) return url;
      const parts = url.split('vimeo.com/');
      if (parts.length > 1) {
         const vimeoId = parts[1].split('/')[0].split('?')[0];
         return `https://player.vimeo.com/video/${vimeoId}`;
      }
    }
    
    return url;
  } catch (e) {
    return url;
  }
}

