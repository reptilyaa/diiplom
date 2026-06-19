import { Link } from 'react-router-dom';
import { PawPrint, Heart, Users, MapPin, ArrowRight, Dog, Cat } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      <section className="relative bg-gradient-to-br from-amber-100 via-amber-50 to-orange-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-amber-500 p-4 rounded-2xl">
                <PawPrint className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Найдите своего{' '}
              <span className="text-amber-600">верного друга</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Тысячи бездомных животных ждут своей второй шанс на счастье. Помогите им найти тёплый дом и любящих хозяев.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pets"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white text-lg font-semibold rounded-xl hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Найти питомца
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-amber-600 text-lg font-semibold rounded-xl hover:bg-amber-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-amber-200"
              >
                Узнать больше
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Спасите жизнь</h3>
            <p className="text-gray-600">
              Каждое усыновление даёт животному новый шанс на счастливую жизнь в тёплом доме.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Поддержите приюты</h3>
            <p className="text-gray-600">
              Ваши пожертвования и помощь позволяют приютам продолжать свою важную работу.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Найдите рядом</h3>
            <p className="text-gray-600">
              Ищите животных по городу, чтобы найти идеального друга неподалёку.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Кого вы ищете?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Выберите тип питомца и начните поиск
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link
            to="/pets?type=dog"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center"
          >
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Dog className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Собаки</h3>
            <p className="text-gray-500 mt-1">Верные и преданные друзья</p>
          </Link>
          <Link
            to="/pets?type=cat"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center"
          >
            <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
              <Cat className="w-10 h-10 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Кошки</h3>
            <p className="text-gray-500 mt-1">Ласковые и независимые</p>
          </Link>
        </div>
      </section>

      <section className="bg-gradient-to-br from-amber-600 to-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Готовы изменить жизнь?
          </h2>
          <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к нашей миссии и помогите бездомным животным обрести дом
          </p>
          <Link
            to="/pets"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-amber-600 text-lg font-semibold rounded-xl hover:bg-amber-50 transition-all shadow-lg"
          >
            Начать поиск
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
