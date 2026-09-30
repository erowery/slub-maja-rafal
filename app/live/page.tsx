'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePhotos, type Photo } from '@/hooks/use-photos';
import { Loader2 } from 'lucide-react';

const SLIDE_MS = 6000;
const REFRESH_MS = 10000;

export default function LiveWall() {
  const { photos, fetchPhotos, loading } = usePhotos();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIndex, setShowIndex] = useState(false);
  const [fade, setFade] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const photosRef = useRef<Photo[]>([]);

  // URL do skanowania = strona główna (gość dodaje zdjęcie), nie /live
  const [addUrl, setAddUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAddUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  const refresh = useCallback(async () => {
    await fetchPhotos();
  }, [fetchPhotos]);

  // Odświeżanie listy zdjęć z Supabase
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  // Automatyczna karuzela
  useEffect(() => {
    if (photos.length === 0) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const len = photosRef.current.length || 1;
          return (prev + 1) % len;
        });
        setFade(true);
      }, 400);
    }, SLIDE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [photos.length]);

  // Gdy pojawią się nowe zdjęcia — pokaż najnowsze
  const prevCount = useRef(0);
  useEffect(() => {
    if (photos.length > prevCount.current && prevCount.current > 0) {
      setCurrentIndex(0); // photos są sortowane od najnowszych
      setFade(true);
    }
    prevCount.current = photos.length;
  }, [photos.length]);

  const currentPhoto: Photo | null =
    photos.length > 0 ? photos[currentIndex % photos.length] : null;

  return (
    <div
      className="fixed inset-0 bg-black overflow-hidden select-none cursor-pointer"
      onClick={() => setShowIndex((s) => !s)}
    >
      {/* Ładowanie */}
      {loading && photos.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <Loader2 className="h-14 w-14 animate-spin text-white/40" />
          <p className="font-body text-white/40 text-lg">Ładowanie galerii…</p>
        </div>
      )}

      {/* Brak zdjęć — czekamy + duży QR */}
      {!loading && !currentPhoto && (
        <div className="flex flex-col items-center justify-center h-full text-white px-8 text-center">
          <p className="font-heading text-5xl md:text-6xl mb-2 tracking-wide">
            Maja <span className="text-white/60">&amp;</span> Rafał
          </p>
          <p className="font-body text-xl text-white/50 mb-10">Live Photo Wall</p>
          <p className="font-body text-base text-white/40 mb-8 max-w-md">
            Czekamy na pierwsze zdjęcia od gości…
          </p>
          {addUrl && (
            <>
              <div className="bg-white p-5 rounded-2xl shadow-2xl">
                <QRCodeSVG value={addUrl} size={200} level="M" />
              </div>
              <p className="font-body text-sm text-white/50 mt-4">
                Zeskanuj kod i dodaj swoje zdjęcie
              </p>
            </>
          )}
        </div>
      )}

      {/* Slajd ze zdjęciem */}
      {currentPhoto && (
        <>
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              key={currentPhoto.id}
              src={currentPhoto.image_url}
              alt={`Zdjęcie od ${currentPhoto.author}`}
              className="max-w-full max-h-full object-contain animate-kenburns"
              draggable={false}
            />
          </div>

          {/* Gradient + podpis autora */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-24 pb-10 px-10 pointer-events-none">
            <p className="font-body text-white text-2xl md:text-3xl font-medium drop-shadow-lg">
              {currentPhoto.author}
            </p>
            {currentPhoto.bingo_task_id != null && (
              <p className="font-body text-white/60 text-base md:text-lg mt-1">
                Zdjęcie z Bingo
              </p>
            )}
          </div>

          {/* Logo / nazwa pary — lewy górny róg */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8 pointer-events-none">
            <p className="font-heading text-white text-2xl md:text-3xl drop-shadow-lg">
              Maja <span className="text-white/60">&amp;</span> Rafał
            </p>
            <p className="font-body text-white/45 text-sm mt-0.5">Live Photo Wall</p>
          </div>

          {/* QR w prawym górnym rogu — zachęta do dodawania */}
          {addUrl && (
            <div className="absolute top-5 right-5 md:top-7 md:right-7 flex flex-col items-center gap-1.5">
              <div className="bg-white p-2.5 rounded-xl shadow-xl">
                <QRCodeSVG value={addUrl} size={88} level="M" />
              </div>
              <p className="font-body text-white/70 text-[11px] drop-shadow">
                Dodaj zdjęcie
              </p>
            </div>
          )}

          {/* Licznik slajdów */}
          <div className="absolute bottom-10 right-10 pointer-events-none">
            <p className="font-body text-white/35 text-sm">
              {(currentIndex % Math.max(photos.length, 1)) + 1} / {photos.length}
            </p>
          </div>
        </>
      )}

      {/* Podgląd wszystkich (klik w ekran) */}
      {showIndex && photos.length > 0 && (
        <div
          className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center gap-3 p-8 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="font-heading text-white text-2xl mb-2">
            Wszystkie zdjęcia ({photos.length})
          </h2>
          <p className="font-body text-white/40 text-sm mb-4">
            Kliknij miniaturę, aby wyświetlić · kliknij tło, aby wrócić
          </p>
          <div
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-w-5xl w-full"
            onClick={() => setShowIndex(false)}
          >
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(i);
                  setFade(true);
                  setShowIndex(false);
                }}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                  i === currentIndex % photos.length
                    ? 'border-white'
                    : 'border-transparent hover:border-white/40'
                }`}
              >
                <img
                  src={p.image_url}
                  alt={p.author}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
