import { useState, useEffect } from 'react';
import { BookOpen, Heart, Calendar, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import FallbackImage from '../components/FallbackImage';
import type { Story } from '../types';

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const { data, error } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setStories(data);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="bg-amber-100 p-3 rounded-full">
            <BookOpen className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Истории успеха</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Каждая история — это новый шанс на счастливую жизнь. Читайте о питомцах, которые нашли свой дом благодаря вам.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Истории появятся скоро</h3>
          <p className="text-gray-600">Здесь будут публиковаться истории о найденных домах для наших питомцев</p>
        </div>
      ) : (
        <div className="space-y-8">
          {stories.map((story) => (
            <article
              key={story.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="aspect-video lg:aspect-auto">
                  <FallbackImage
                    src={story.image_url}
                    fallbackSrc="/images/pet-fallback.svg"
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    {new Date(story.created_at).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{story.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{story.content}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
