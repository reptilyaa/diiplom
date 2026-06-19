import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.from('messages').insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      content: formData.message,
    });

    if (error) {
      setError('Ошибка отправки. Попробуйте позже.');
    } else {
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Свяжитесь с нами</h1>
        <p className="text-xl text-gray-600">
          Есть вопросы или хотите помочь? Мы всегда рады вашим сообщениям.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {success ? (
              <div className="text-center py-12">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Сообщение отправлено!</h3>
                <p className="text-gray-600 mb-6">Мы свяжемся с вами в ближайшее время.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-amber-600 hover:underline font-medium"
                >
                  Отправить ещё одно сообщение
                </button>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ваше имя"
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@email.com"
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+7 (999) 123-45-67"
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Тема</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="">Выберите тему</option>
                        <option value="adoption">Усыновление</option>
                        <option value="volunteer">Волонтёрство</option>
                        <option value="donation">Пожертвования</option>
                        <option value="partnership">Сотрудничество</option>
                        <option value="other">Другое</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Сообщение</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Напишите ваше сообщение..."
                      rows={5}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-semibold disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Отправить сообщение
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Контактная информация</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Адрес</p>
                  <p className="text-gray-600">г. Москва, ул. Добрая, д. 15</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-xl">
                  <Phone className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Телефон</p>
                  <p className="text-gray-600">+7 (999) 123-45-67</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-xl">
                  <Mail className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-gray-600">info@dobrodom.ru</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gray-100 h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Карта</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Время работы</h2>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Пн - Пт:</span>
                <span className="font-medium">10:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Сб:</span>
                <span className="font-medium">10:00 - 16:00</span>
              </div>
              <div className="flex justify-between">
                <span>Вс:</span>
                <span className="font-medium">Выходной</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
