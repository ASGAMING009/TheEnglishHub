import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploadFormProps {
  clubId: string;
  onSuccess: () => void;
}

export default function ImageUploadForm({ clubId, onSuccess }: ImageUploadFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0] || !preview) return;

    setIsLoading(true);
    setError('');

    try {
      const file = fileInputRef.current.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('clubId', clubId);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-activity`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { data: insertData, error: insertError } = await supabase
        .from('club_activities')
        .insert({
          club_id: clubId,
          image_url: `data:${file.type};base64,${await fileToBase64(file)}`,
          description: '',
        });

      if (insertError) throw insertError;

      setPreview(null);
      setIsOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-all duration-300 hover:bg-blue-700 active:scale-95"
      >
        <Upload className="h-5 w-5" />
        <span>Post Picture</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">Post Activity Picture</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setPreview(null);
                  setError('');
                }}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpload}>
              {!preview ? (
                <label className="block border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-slate-700 font-medium">Click to select image</p>
                  <p className="text-sm text-slate-500">PNG, JPG, GIF up to 5MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <img src={preview} alt="Preview" className="w-full rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="w-full px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              )}

              {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

              <button
                type="submit"
                disabled={!preview || isLoading}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Uploading...' : 'Upload Picture'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
