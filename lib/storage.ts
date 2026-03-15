import { supabase } from '@/lib/supabase';

export async function uploadRangeLogo(file: File): Promise<{ url?: string; error?: string }> {
  const ext = file.name.split('.').pop() || 'png';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('range-logos').upload(path, file, { upsert: true });
  if (error) return { error: error.message };
  const { data } = supabase.storage.from('range-logos').getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function uploadProductImage(file: File): Promise<{ url?: string; error?: string }> {
  const ext = file.name.split('.').pop() || 'png';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });
  if (error) return { error: error.message };
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return { url: data.publicUrl };
}
