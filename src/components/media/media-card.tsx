import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { Program } from "@/types";
export function MediaCard({ program }: { program: Program }) {
  return (
    <Link href={`/programas/${program.slug}`} className="media-card">
      <div className="card-image">
        <Image
          src={program.coverPath}
          alt={`Ilustração conceitual de ${program.title}`}
          fill
          sizes="(max-width: 640px) 75vw, (max-width: 1024px) 40vw, 25vw"
        />
        <span className="card-play" aria-hidden="true">
          <Play size={20} />
        </span>
        <span className="card-duration">{program.durationMinutes} min</span>
      </div>
      <p className="card-category">{program.category}</p>
      <h3>{program.title}</h3>
    </Link>
  );
}
