import { Book } from "../data/mockData";
import { useNavigate } from "react-router";
import { Users } from "lucide-react";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/book/${book.id}`)}
      className="group cursor-pointer"
    >
      {/* Book Cover */}
      <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded bg-muted">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          <span className="text-[10px] px-2 py-0.5 bg-background/90 backdrop-blur-sm rounded-full border border-border">
            {book.condition}
          </span>
          {book.isReserved && book.queueCount ? (
            <span className="text-[10px] px-2 py-0.5 bg-foreground/90 text-background backdrop-blur-sm rounded-full flex items-center gap-1">
              <Users className="h-3 w-3" />
              {book.queueCount}
            </span>
          ) : null}
        </div>
      </div>

      {/* Book Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium line-clamp-2 leading-tight group-hover:text-muted-foreground transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-sm font-medium">NT$ {book.price}</span>
        </div>
      </div>
    </article>
  );
}