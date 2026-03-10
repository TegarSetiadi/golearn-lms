"use client";

import { cn } from "@/lib/utils";

interface VideoPlayerProps {
    url: string | null;
    className?: string;
}

export default function VideoPlayer({ url, className }: VideoPlayerProps) {
    if (!url) {
        return (
            <div className={cn("aspect-video bg-slate-900 flex items-center justify-center rounded-2xl border border-primary/20", className)}>
                <p className="text-white font-medium">No video available</p>
            </div>
        );
    }

    // Basic handling for YouTube embed
    let embedUrl = url;
    if (url.includes("youtube.com/watch?v=")) {
        embedUrl = url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
        embedUrl = url.replace("youtu.be/", "youtube.com/embed/");
    }

    return (
        <div className={cn("relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/10", className)}>
            <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
}
