'use client';

import { useEffect, useRef, useState } from 'react';
import { usePhotos, type Photo } from '@/hooks/use-photos';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, Download, X, Loader2 } from 'lucide-react';
import { bingoTasks } from '@/lib/bingo-data';

export function Gallery() {
  const { photos, loading, fetchPhotos, uploadPhoto } = usePhotos();
  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewerPhoto, setViewerPhoto] = useState<Photo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

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
    if (!selectedFile) {
      setError('Wybierz zdjęcie');
      return;
    }
    if (!author.trim()) {
      setError('Podaj swoje imię');
      return;
    }
    setUploading(true);
    setError(null);
    const result = await uploadPhoto(selectedFile, author.trim());
    setUploading(false);
    if (result) {
      setOpen(false);
      setSelectedFile(null);
      setPreview(null);
      setAuthor('');
    } else {
      setError('Nie udało się wgrać zdjęcia. Spróbuj ponownie.');
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setAuthor('');
    setError(null);
  };

  return (
    <div className="px-4 pt-8 pb-4">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-[28px] text-neutral-900 leading-tight">
          Wesele Mai i Rafała
        </h1>
        <p className="mt-3 text-[13px] text-neutral-500 font-body leading-relaxed max-w-xs mx-auto">
          Pokaż nam, jak się bawisz! Pozwól, by Twoje zdjęcia
          były częścią wspomnień z tego wyjątkowego dnia ❤️
        </p>
      </div>

      <button
        onClick={() => {
          resetForm();
          setOpen(true);
        }}
        className="w-full flex items-center justify-center gap-2 border border-neutral-900 rounded-full py-3 px-4 text-[14px] font-body font-medium text-neutral-900 hover:bg-neutral-50 transition-colors mb-6"
      >
        <Camera className="h-4 w-4" strokeWidth={1.75} />
        Dodaj zdjęcie
      </button>

      {loading && photos.length === 0 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-16 text-neutral-400 font-body text-sm">
          Jeszcze nie ma zdjęć — bądź pierwszy!
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo) => {
            const task = photo.bingo_task_id
              ? bingoTasks.find((t) => t.id === photo.bingo_task_id)
              : null;
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setViewerPhoto(photo)}
                className="relative aspect-square overflow-hidden bg-neutral-100 text-left"
              >
                <img
                  src={photo.image_url}
                  alt={`Zdjęcie od ${photo.author}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
                  <p className="text-white text-[11px] font-body font-medium truncate">
                    {photo.author}
                  </p>
                  {task && (
                    <p className="text-white/80 text-[10px] font-body truncate">
                      {task.title}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) resetForm();
        }}
      >
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-center">
              Dodaj zdjęcie
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
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
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 border border-neutral-300 rounded-xl py-6 text-sm font-body text-neutral-600 hover:bg-neutral-50"
                >
                  📷 Aparat
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 border border-neutral-300 rounded-xl py-6 text-sm font-body text-neutral-600 hover:bg-neutral-50"
                >
                  🖼️ Galeria
                </button>
              </div>
            )}

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelect}
            />
            <input
              ref={fileInputRef}
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
              disabled={uploading}
              className="w-full bg-neutral-900 text-white rounded-full py-3 text-sm font-body font-medium disabled:opacity-50 flex items-center justify-center gap-2"
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
        </DialogContent>
      </Dialog>

      {viewerPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setViewerPhoto(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10"
            onClick={() => setViewerPhoto(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={viewerPhoto.image_url}
              alt={`Zdjęcie od ${viewerPhoto.author}`}
              className="w-full max-h-[75vh] object-contain rounded-lg"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-white font-body font-medium text-base">
                {viewerPhoto.author}
              </p>
              <a
                href={viewerPhoto.image_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white bg-white/10 rounded-full px-4 py-2 text-sm font-body"
              >
                <Download className="h-4 w-4" />
                Pobierz
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
