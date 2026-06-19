import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Calendar, ArrowLeft, Edit, Send, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import FallbackImage from '../components/FallbackImage';
import type { Pet } from '../types';

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPet(id);
      if (user) {
        checkFavorite(id);
      }
    }
  }, [id, user]);

  const fetchPet = async (petId: string) => {
    const { data, error } = await supabase.from('pets').select('*').eq('id', petId).single();
    if (!error && data) {
      setPet(data);
    }
    setLoading(false);
  };

  const checkFavorite = async (petId: string) => {
    if (!user) return;
    const { data } = await supabase.from('favorites').select('id').match({ user_id: user.id, pet_id: petId }).single();
    setIsFavorite(!!data);
  };

  const toggleFavorite = async () => {
    if (!user || !pet) return;

    if (isFavorite) {
      await supabase.from('favorites').delete().match({ user_id: user.id, pet_id: pet.id });
      setIsFavorite(false);
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, pet_id: pet.id });
      setIsFavorite(true);
    }
  };

  const submitRequest = async () => {
    if (!user || !pet) return;
    setSubmitting(true);

    const { error } = await supabase.from('adoption_requests').insert({
      user_id: user.id,
      pet_id: pet.id,
      message: requestMessage,
      status: 'pending',
    });

    if (!error) {
      setRequestSent(true);
      setTimeout(() => setShowRequestModal(false), 2000);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Питомец не найден</h1>
        <Link to="/pets" className="text-amber-600 hover:underline">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/pets"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Назад к списку
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
            <FallbackImage
              src={pet.image_url}
              fallbackSrc="/images/pet-fallback.svg"
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          </div>
          {user && (
            <button
              onClick={toggleFavorite}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all ${
                isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{pet.name}</h1>
            <p className="text-xl text-gray-600">{pet.breed}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full">
              <Calendar className="w-5 h-5" />
              <span>
                {pet.age} {pet.age === 1 ? 'год' : pet.age < 5 ? 'года' : 'лет'}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
              <MapPin className="w-5 h-5" />
              <span>{pet.city}</span>
            </div>
            {pet.gender && pet.gender !== 'unknown' && (
              <div className={`px-4 py-2 rounded-full ${pet.gender === 'male' ? 'bg-sky-100 text-sky-800' : 'bg-pink-100 text-pink-800'}`}>
                {pet.gender === 'male' ? 'Мальчик' : 'Девочка'}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">О питомце</h2>
            <p className="text-gray-600 leading-relaxed">{pet.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {user ? (
              <>
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-semibold shadow-lg"
                >
                  <Send className="w-5 h-5" />
                  Отправить заявку
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                    isFavorite
                      ? 'bg-red-100 text-red-600 border-2 border-red-200'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-300 hover:text-amber-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'В избранном' : 'В избранное'}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-semibold shadow-lg"
              >
                Войти, чтобы отправить заявку
              </Link>
            )}
          </div>

          {isAdmin && (
            <Link
              to={`/pets/${pet.id}/edit`}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              <Edit className="w-5 h-5" />
              Редактировать информацию
            </Link>
          )}
        </div>
      </div>

      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            {requestSent ? (
              <div className="text-center py-8">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Заявка отправлена!</h3>
                <p className="text-gray-600">Мы свяжемся с вами в ближайшее время.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Заявка на усыновление</h3>
                <p className="text-gray-600 mb-4">
                  Вы отправляете заявку на усыновление {pet.name}. Расскажите немного о себе и почему вы хотите взять этого питомца.
                </p>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Опишите ваш опыт с животными, условия проживания..."
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-h-[120px] resize-none"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={submitRequest}
                    disabled={submitting || !requestMessage.trim()}
                    className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Отправить
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
