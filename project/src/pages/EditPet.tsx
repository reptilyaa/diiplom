import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';import FallbackImage from '../components/FallbackImage';import type { Pet } from '../types';

const breeds = [
  'Персидская кошка',
  'Сибирская кошка',
  'Британская кошка',
  'Мейн-кун',
  'Рэгдолл',
  'Немецкая овчарка',
  'Золотистый ретривер',
  'Лабрадор',
  'Хаски',
  'Дворняга',
];

const cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Краснодар', 'Самара', 'Воронеж', 'Нижний Новгород', 'Ростов-на-Дону'];

export default function EditPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSuccess, setSavingSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: '',
    city: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      return;
    }
    if (id) {
      fetchPet(id);
    }
  }, [id, user, isAdmin, navigate]);

  const fetchPet = async (petId: string) => {
    const { data, error } = await supabase.from('pets').select('*').eq('id', petId).single();
    if (!error && data) {
      setPet(data);
      setFormData({
        name: data.name,
        breed: data.breed,
        age: data.age.toString(),
        gender: data.gender || '',
        city: data.city,
        description: data.description || '',
        image_url: data.image_url || '',
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet) return;

    setSaving(true);
    setSavingSuccess(false);

    const { error } = await supabase
      .from('pets')
      .update({
        name: formData.name,
        breed: formData.breed,
        age: parseInt(formData.age),
        gender: formData.gender,
        city: formData.city,
        description: formData.description,
        image_url: formData.image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pet.id);

    if (!error) {
      setSavingSuccess(true);
      setTimeout(() => {
        navigate(`/pets/${pet.id}`);
      }, 1000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Доступ запрещён</h1>
          <p className="text-gray-600 mb-6">
            Редактировать информацию о животных может только первый зарегистрированный пользователь.
          </p>
          <Link
            to="/pets"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-semibold"
          >
            Вернуться к списку
          </Link>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Питомец не найден</h1>
        <Link to="/pets" className="text-amber-600 hover:underline">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to={`/pets/${pet.id}`}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Назад к питомцу
      </Link>

      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Редактировать питомца</h1>

        {savingSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-xl flex items-center gap-2">
            <Save className="w-5 h-5" />
            Изменения сохранены! Перенаправление...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Порода</label>
              <select
                required
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {breeds.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Город</label>
              <select
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Возраст (лет)</label>
              <input
                type="number"
                required
                min="0"
                max="30"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Пол</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Не указан</option>
                <option value="male">Мальчик</option>
                <option value="female">Девочка</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL изображения</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://..."
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <div className="mt-2">
              <FallbackImage
                src={formData.image_url || '/images/pet-fallback.svg'}
                fallbackSrc="/images/pet-fallback.svg"
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-semibold disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Сохранить изменения
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
