"use client";

/**
 * SequenceEditor.tsx — Panneau bas : éditeur de séquence + transport.
 *
 * L'utilisateur écrit une séquence (moveTo / delay / setServo / home), puis
 * « Exécuter » la joue sur le bras 3D. « Home » et « Stop » complètent le
 * transport. La logique d'exécution vit dans sequenceRunner (isolée, portable
 * vers un sketch Arduino).
 */

import { Play, Square, Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SequenceEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onStop: () => void;
  onHome: () => void;
  isRunning: boolean;
  status: string;
  error: string | null;
}

export function SequenceEditor({
  value,
  onChange,
  onRun,
  onStop,
  onHome,
  isRunning,
  status,
  error,
}: SequenceEditorProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            Séquence
          </span>
          <span className="font-mono text-[11px] text-muted/70">
            moveTo([…]) · delay(ms) · setServo(ch, °) · home()
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onHome}
            disabled={isRunning}
          >
            <Home className="h-3.5 w-3.5" />
            Home
          </Button>
          {isRunning ? (
            <Button size="sm" variant="danger" onClick={onStop}>
              <Square className="h-3.5 w-3.5" />
              Stop
            </Button>
          ) : (
            <Button size="sm" variant="default" onClick={onRun}>
              <Play className="h-3.5 w-3.5" />
              Exécuter
            </Button>
          )}
        </div>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isRunning}
        rows={10}
        className="min-h-[180px] flex-1"
      />

      <div className="flex min-h-[20px] items-center gap-2 text-xs">
        {error ? (
          <span className="flex items-center gap-1.5 text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </span>
        ) : (
          <span className="text-muted">{status}</span>
        )}
      </div>
    </div>
  );
}
