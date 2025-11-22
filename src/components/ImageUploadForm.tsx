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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
    if (!fileInputRef.current?.files?.[0] || !preview || !title.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const file = fileInputRef.current.files[0];
      const imageBase64 = await fileToBase64(file);

      const { data: insertData, error: insertError } = await supabase
        .from('club_activities')
        .insert({
          club_id: clubId,
          image_url: `data:${file.type};base64,${imageBase64}`,
          title: title.trim(),
          description: description.trim(),
        });

      if (insertError) throw insertError;

      setPreview(null);
      setTitle('');
      setDescription('');
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

            <form onSubmit={handleUpload} className="space-y-4">
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
                  <img src={preview} alt="Preview" className="w-full rounded-lg max-h-48 object-cover" />
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

              {preview && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Post Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter post title"
                      maxLength={100}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a description (optional)"
                      maxLength={300}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {description.length}/300
                    </p>
                  </div>
                </>
              )}

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={!preview || !title.trim() || isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Posting...' : 'Post Activity'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
