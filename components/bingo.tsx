'use client';

import { useState, useRef } from 'react';
import { bingoTasks, type BingoTask } from '@/lib/bingo-data';
import { usePhotos } from '@/hooks/use-photos';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Loader2, X } from 'lucide-react';

export function Bingo() {
  const { uploadPhoto } = usePhotos();
  const [activeTask, setActiveTask] = useState<BingoTask | null>(null);
  const [author, setAuthor] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Wybierz plik zdjęcia');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile || !author.trim() || !activeTask) return;
    setUploading(true);
    setError(null);
    const result = await uploadPhoto(selectedFile, author.trim(), activeTask.id);
    setUploading(false);
    if (result) {
      setCompleted((prev) =>
        prev.includes(activeTask.id) ? prev : [...prev, activeTask.id]
      );
      setActiveTask(null);
      setSelectedFile(null);
      setPreview(null);
      setAuthor('');
    } else {
      setError('Nie udało się wgrać zdjęcia. Spróbuj ponownie.');
    }
  };

  const openTask = (task: BingoTask) => {
    setActiveTask(task);
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setAuthor('');
  };

  const closeTask = () => {
    setActiveTask(null);
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  // Take first 9 tasks for 3x3 grid like the screenshot
  const gridTasks = bingoTasks.slice(0, 9);

  return (
    <div className="px-4 pt-8 pb-4">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-[28px] text-neutral-900 leading-tight">
          Wesele Mai i Rafała
        </h1>
        <h2 className="font-heading text-xl text-neutral-800 mt-4 mb-1">
          Bingo zdjęć
        </h2>
        <p className="text-[13px] text-neutral-500 font-body leading-relaxed max-w-xs mx-auto">
          Wykonaj zadania! Kliknij w nie i prześlij zdjęcie, trafi także
          do głównej galerii
        </p>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {gridTasks.map((task) => {
          const isDone = completed.includes(task.id);
          return (
            <button
              key={task.id}
              type="button"
              onClick={() => openTask(task)}
              className={`aspect-square flex items-center justify-center p-2 text-center transition-opacity ${
                isDone
                  ? 'bg-[#5c1a3a] opacity-90'
                  : 'bg-[#7a2d54] hover:opacity-90'
              }`}
            >
              <span className="text-white text-[11px] sm:text-[12px] font-body font-medium leading-snug px-0.5">
                {isDone && (
                  <Check className="h-3.5 w-3.5 mx-auto mb-1 opacity-90" strokeWidth={2.5} />
                )}
                {task.title}
              </span>
            </button>
          );
        })}
      </div>

      <Dialog open={!!activeTask} onOpenChange={(v) => !v && closeTask()}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-center">
              {activeTask?.title}
            </DialogTitle>
          </DialogHeader>
          {activeTask && (
            <div className="space-y-4 pt-1">
              <p className="text-sm text-neutral-500 text-center font-body">
                {activeTask.description}
              </p>

              <Input
                placeholder="Twoje imię"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="rounded-full border-neutral-300"
              />

              {preview ? (
                <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100">
                  <img src={preview} alt="Podgląd" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => cameraRef.current?.click()}
                    className="flex-1 border border-neutral-300 rounded-xl py-6 text-sm font-body text-neutral-600"
                  >
                    📷 Aparat
                  </button>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex-1 border border-neutral-300 rounded-xl py-6 text-sm font-body text-neutral-600"
                  >
                    🖼️ Galeria
                  </button>
                </div>
              )}

              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />

              {error && (
                <p className="text-sm text-red-600 text-center font-body">{error}</p>
              )}

              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading || !selectedFile || !author.trim()}
                className="w-full bg-neutral-900 text-white rounded-full py-3 text-sm font-body font-medium disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Wysyłanie…
                  </>
                ) : (
                  'Wyślij zdjęcie'
                )}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
