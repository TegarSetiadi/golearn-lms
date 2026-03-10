import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
    id: string;
    title: string;
    instructorName: string;
    price: number;
    thumbnail: string | null;
    categoryName: string;
    rating?: number;
    studentsCount?: number;
}

export default function CourseCard({
    id,
    title,
    instructorName,
    price,
    thumbnail,
    categoryName,
    rating = 4.8,
    studentsCount = 120,
}: CourseCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border bg-background transition-all hover:shadow-lg">
            <div className="aspect-video relative overflow-hidden">
                {thumbnail ? (
                    <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold">No Preview</span>
                    </div>
                )}
                <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90 text-primary-foreground text-[10px] font-bold uppercase">
                        {categoryName}
                    </Badge>
                </div>
            </div>
            <div className="p-5">
                <div className="flex items-center gap-1 text-amber-500 mb-2">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-xs font-bold">{rating}</span>
                    <span className="text-[10px] text-muted-foreground ml-1">({studentsCount} reviews)</span>
                </div>
                <h3 className="text-lg font-bold text-primary leading-tight mb-1 line-clamp-2">
                    {title}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">by {instructorName}</p>
                <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-xl font-bold text-primary">
                        {price === 0 ? "Free" : `$${price.toFixed(2)}`}
                    </span>
                    <Link href={`/courses/${id}`}>
                        <Button size="sm" variant="outline" className="text-xs border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
                            Learn More
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
