import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { User, Heart, FileText, LogOut, Loader, Settings, Key, Edit2, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import FallbackImage from '../components/FallbackImage';
import type { Favorite, AdoptionRequest } from '../types';

export default function Profile() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'favorites' | 'requests' | 'settings'>('favorites');
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    const { data } = await supabase.from('user_profiles').select('name').eq('id', user!.id).single();
    if (data?.name) {
      setUserName(data.name);
      setNameInput(data.name);
    }
  };

  const fetchUserData = async () => {
    setLoading(true);

    const { data: favData } = await supabase
      .from('favorites')
      .select('*, pet:pets(*)')
      .eq('user_id', user!.id);
    if (favData) setFavorites(favData);

    const { data: reqData } = await supabase
      .from('adoption_requests')
      .select('*, pet:pets(*)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    if (reqData) setRequests(reqData);

    setLoading(false);
  };

  const removeFavorite = async (petId: string) => {
    await supabase.from('favorites').delete().match({ user_id: user!.id, pet_id: petId });
    setFavorites(favorites.filter((f) => f.pet_id !== petId));
  };

  const updateName = async () => {
    if (!nameInput.trim()) return;
    setSavingName(true);
    const { error } = await supabase
      .from('user_profiles')
      .upsert({ id: user!.id, name: nameInput.trim(), updated_at: new Date().toISOString() });
    if (!error) {
      setUserName(nameInput.trim());
      setEditingName(false);
    }
    setSavingName(false);
  };

  const changePassword = async () => {
    setPasswordError('');
    setPasswordSuccess(false);

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Заполните все поля');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Новый пароль должен быть не менее 6 символов');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Новые пароли не совпадают');
      return;
    }

    setSavingPassword(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user!.email!,
      password: passwordForm.currentPassword,
    });

    if (signInError) {
      setPasswordError('Текущий пароль неверен');
      setSavingPassword(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordForm.newPassword,
    });

    if (updateError) {
      setPasswordError('Ошибка при смене пароля');
    } else {
      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowPasswordModal(false), 2000);
    }

    setSavingPassword(false);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      pending: 'На рассмотрении',
      approved: 'Одобрено',
      rejected: 'Отклонено',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full">
              <User className="w-8 h-8 text-amber-500" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{userName || 'Личный кабинет'}</h1>
              <p className="text-amber-100">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-gray-600 hover:text-amber-600'
            }`}
          >
            <Heart className="w-5 h-5" />
            Избранное ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'requests'
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-gray-600 hover:text-amber-600'
            }`}
          >
            <FileText className="w-5 h-5" />
            Заявки ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-gray-600 hover:text-amber-600'
            }`}
          >
            <Settings className="w-5 h-5" />
            Настройки
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-amber-500" />
            </div>
          ) : activeTab === 'favorites' ? (
            favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Список избранного пуст</h3>
                <p className="text-gray-600 mb-4">Добавьте питомцев в избранное, чтобы они появились здесь</p>
                <Link
                  to="/pets"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-medium"
                >
                  Найти питомца
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((fav) => (
                  <div key={fav.id} className="group relative bg-gray-50 rounded-xl overflow-hidden">
                    <Link to={`/pets/${fav.pet_id}`} className="block">
                      <div className="aspect-square">
                        <FallbackImage
                          src={fav.pet?.image_url}
                          fallbackSrc="/images/pet-fallback.svg"
                          alt={fav.pet?.name || 'Питомец'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">{fav.pet?.name}</h3>
                        <p className="text-sm text-gray-600">{fav.pet?.breed}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => removeFavorite(fav.pet_id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : activeTab === 'requests' ? (
            requests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет отправленных заявок</h3>
                <p className="text-gray-600 mb-4">Ваши заявки на усыновление появятся здесь</p>
                <Link
                  to="/pets"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-medium"
                >
                  Найти питомца
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Link to={`/pets/${req.pet_id}`} className="flex-shrink-0">
                      <FallbackImage
                        src={req.pet?.image_url}
                        fallbackSrc="/images/pet-fallback.svg"
                        alt={req.pet?.name || 'Питомец'}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/pets/${req.pet_id}`} className="block">
                        <h3 className="font-semibold text-gray-900 hover:text-amber-600 transition-colors">
                          {req.pet?.name}
                        </h3>
                        <p className="text-sm text-gray-600">{req.pet?.breed}</p>
                      </Link>
                      {req.message && (
                        <p className="text-sm text-gray-500 mt-1 truncate">{req.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(req.status)}
                      <p className="text-xs text-gray-400">
                        {new Date(req.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Личная информация</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                    {editingName ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          placeholder="Введите ваше имя"
                        />
                        <button
                          onClick={updateName}
                          disabled={savingName}
                          className="px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
                        >
                          {savingName ? <Loader className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => { setEditingName(false); setNameInput(userName); }}
                          className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-gray-900">{userName || 'Не указано'}</span>
                        <button
                          onClick={() => setEditingName(true)}
                          className="p-2 text-gray-500 hover:text-amber-600 transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="p-3 bg-white rounded-xl border border-gray-200 text-gray-500">
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Безопасность</h3>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-amber-300 hover:text-amber-600 transition-colors font-medium"
                >
                  <Key className="w-5 h-5" />
                  Сменить пароль
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          Выйти из аккаунта
        </button>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            {passwordSuccess ? (
              <div className="text-center py-8">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Пароль изменён!</h3>
                <p className="text-gray-600">Ваш пароль успешно обновлён.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Смена пароля</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Текущий пароль</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Новый пароль</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Подтвердите новый пароль</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  {passwordError && (
                    <p className="text-red-600 text-sm">{passwordError}</p>
                  )}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => { setShowPasswordModal(false); setPasswordError(''); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={changePassword}
                    disabled={savingPassword}
                    className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {savingPassword ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      'Сохранить'
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
