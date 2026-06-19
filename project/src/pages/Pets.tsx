import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, Heart, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LOCAL_PETS, filterLocalPets } from '../lib/localPets';
import { useAuth } from '../contexts/AuthContext';
import FallbackImage from '../components/FallbackImage';
import type { Pet } from '../types';

const breeds = [
  'Все породы',
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

const cities = ['Все города', 'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Краснодар', 'Самара', 'Воронеж', 'Нижний Новгород', 'Ростов-на-Дону'];

export default function Pets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [localFallbackActive, setLocalFallbackActive] = useState(false);
  const { user } = useAuth();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [breed, setBreed] = useState(searchParams.get('breed') || 'Все породы');
  const [city, setCity] = useState(searchParams.get('city') || 'Все города');
  const [ageMin, setAgeMin] = useState(searchParams.get('ageMin') || '');
  const [ageMax, setAgeMax] = useState(searchParams.get('ageMax') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || '');

  useEffect(() => {
    fetchPets();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchPets = async () => {
    const localFiltered = filterLocalPets({ search, breed, city, ageMin, ageMax, gender });
    setPets(localFiltered);
    setLocalFallbackActive(false);
    setLoading(false);

    let remotePets: Pet[] = [];
    const remoteQuery = async () => {
      let query = supabase.from('pets').select('*');

      if (breed && breed !== 'Все породы') {
        query = query.eq('breed', breed);
      }
      if (city && city !== 'Все города') {
        query = query.eq('city', city);
      }
      if (ageMin) {
        query = query.gte('age', parseInt(ageMin));
      }
      if (ageMax) {
        query = query.lte('age', parseInt(ageMax));
      }
      if (gender) {
        query = query.eq('gender', gender);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data as Pet[];
      }
      throw new Error('remote-fetch-failed');
    };

    try {
      const timeoutPromise = new Promise<Pet[]>((_, reject) => {
        window.setTimeout(() => reject(new Error('remote-timeout')), 4000);
      });
      remotePets = await Promise.race([remoteQuery(), timeoutPromise]);

      let filtered = remotePets;
      if (search) {
        const normalizedSearch = search.toLowerCase();
        filtered = remotePets.filter(
          (pet) =>
            pet.name.toLowerCase().includes(normalizedSearch) ||
            pet.breed.toLowerCase().includes(normalizedSearch) ||
            pet.city.toLowerCase().includes(normalizedSearch)
        );
      }

      const mergedPets = [...filtered];
      localFiltered.forEach((localPet) => {
        if (!mergedPets.find((p) => p.id === localPet.id)) {
          mergedPets.push(localPet);
        }
      });

      setPets(mergedPets);
    } catch {
      setPets(localFiltered);
      setLocalFallbackActive(true);
    }
  };

  const fetchFavorites = async () => {
    const { data } = await supabase.from('favorites').select('pet_id');
    if (data) {
      setFavorites(data.map((f) => f.pet_id));
    }
  };

  const toggleFavorite = async (petId: string) => {
    if (!user) return;

    if (favorites.includes(petId)) {
      await supabase.from('favorites').delete().match({ user_id: user.id, pet_id: petId });
      setFavorites(favorites.filter((id) => id !== petId));
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, pet_id: petId });
      setFavorites([...favorites, petId]);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (breed !== 'Все породы') params.set('breed', breed);
    if (city !== 'Все города') params.set('city', city);
    if (ageMin) params.set('ageMin', ageMin);
    if (ageMax) params.set('ageMax', ageMax);
    if (gender) params.set('gender', gender);
    setSearchParams(params);
    fetchPets();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearch('');
    setBreed('Все породы');
    setCity('Все города');
    setAgeMin('');
    setAgeMax('');
    setGender('');
    setSearchParams({});
    fetchPets();
  };

  const hasActiveFilters = search || breed !== 'Все породы' || city !== 'Все города' || ageMin || ageMax || gender;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Питомцы</h1>
        <p className="text-gray-600">Найдите своего идеального друга</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по имени, породе или городу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
            >
              <Filter className="w-5 h-5" />
              Фильтры
            </button>
            <button
              onClick={applyFilters}
              className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-medium"
            >
              Найти
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Порода</label>
              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
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
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Возраст от</label>
              <input
                type="number"
                min="0"
                max="20"
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value)}
                placeholder="Мин. возраст"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Возраст до</label>
              <input
                type="number"
                min="0"
                max="20"
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value)}
                placeholder="Макс. возраст"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Пол</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Все</option>
                <option value="male">Мальчик</option>
                <option value="female">Девочка</option>
              </select>
            </div>
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                >
                  <X className="w-5 h-5" />
                  Сбросить
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {localFallbackActive && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          Показаны резервные питомцы из локальной базы, так как подключение к серверу временно недоступно.
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
              Поиск: {search}
              <button onClick={() => { setSearch(''); applyFilters(); }} className="hover:text-amber-900">
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
          {breed !== 'Все породы' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
              {breed}
              <button onClick={() => { setBreed('Все породы'); applyFilters(); }} className="hover:text-amber-900">
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
          {city !== 'Все города' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
              {city}
              <button onClick={() => { setCity('Все города'); applyFilters(); }} className="hover:text-amber-900">
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ничего не найдено</h3>
          <p className="text-gray-600 mb-4">Попробуйте изменить параметры поиска</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <Link to={`/pets/${pet.id}`}>
                <div className="relative aspect-square overflow-hidden">
                  <FallbackImage
                    src={pet.image_url}
                    fallbackSrc="/images/pet-fallback.svg"
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </Link>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/pets/${pet.id}`} className="hover:text-amber-600 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                  </Link>
                  {user && (
                    <button
                      onClick={() => toggleFavorite(pet.id)}
                      className={`p-2 rounded-full transition-all ${
                        favorites.includes(pet.id)
                          ? 'bg-red-100 text-red-500'
                          : 'bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(pet.id) ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">{pet.breed}</p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{pet.age} {pet.age === 1 ? 'год' : pet.age < 5 ? 'года' : 'лет'}</span>
                  {pet.gender && pet.gender !== 'unknown' && (
                    <span className="flex items-center gap-1">
                      {pet.gender === 'male' ? '♂' : '♀'}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {pet.city}
                  </span>
                </div>
                <Link
                  to={`/pets/${pet.id}`}
                  className="mt-4 block w-full text-center py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors font-medium"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
