'use client';

import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type Photo = {
  id: string;
  author: string;
  image_url: string;
  bingo_task_id: number | null;
  created_at: string;
};

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching photos:', error.message);
        setPhotos([]);
      } else {
        setPhotos(data ?? []);
      }
    } catch (e) {
      console.error('fetchPhotos exception:', e);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadPhoto = useCallback(
    async (file: File, author: string, bingoTaskId?: number): Promise<Photo | null> => {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('wedding-photos')
          .upload(filePath, file, { cacheControl: '3600' });

        if (uploadError) {
          console.error('Upload error:', uploadError.message);
          return null;
        }

        const { data: urlData } = supabase.storage
          .from('wedding-photos')
          .getPublicUrl(filePath);

        const { data, error: insertError } = await supabase
          .from('photos')
          .insert({
            author,
            image_url: urlData.publicUrl,
            bingo_task_id: bingoTaskId ?? null,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Insert error:', insertError.message);
          return null;
        }

        setPhotos((prev) => [data as Photo, ...prev]);
        return data as Photo;
      } catch (e) {
        console.error('uploadPhoto exception:', e);
        return null;
      }
    },
    []
  );

  return { photos, loading, fetchPhotos, uploadPhoto };
}
