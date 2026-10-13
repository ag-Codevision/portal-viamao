"use client";
import { useState } from "react";
import { Play, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";
export function DemoPlayer({ title }: { title: string }) {
  const [message, setMessage] = useState(false);
  return (
    <div className="demo-player">
      <span className="demo-badge">DEMONSTRAÇÃO · PRÉVIA DO PLAYER</span>
      <div>
        <MonitorPlay size={40} />
        <h2>{title}</h2>
        <p>
          Este espaço está preparado para um player autorizado.
          <br />
          Não há vídeo ou sinal ao vivo nesta versão.
        </p>
        <Button variant="secondary" onClick={() => setMessage(true)}>
          <Play size={16} /> Conhecer a prévia
        </Button>
        {message && (
          <p role="status" className="player-message">
            Prévia disponível: explore os detalhes e a grade demonstrativa
            abaixo. A reprodução será integrada em uma próxima etapa.
          </p>
        )}
      </div>
      <span className="player-bottom">Sem autoplay · Sem transmissão real</span>
    </div>
  );
}
