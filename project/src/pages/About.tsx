import { Heart, Users, Target, Award, PawPrint, MapPin, Phone, Mail } from 'lucide-react';
import FallbackImage from '../components/FallbackImage';

const teamMembers = [
  {
    name: 'Анна Петрова',
    role: 'Основатель',
    image: '/images/team-1.svg',
  },
  {
    name: 'Михаил Сидоров',
    role: 'Директор приюта',
    image: '/images/team-2.svg',
  },
  {
    name: 'Елена Козлова',
    role: 'Ветеринар',
    image: '/images/team-3.svg',
  },
  {
    name: 'Дмитрий Иванов',
    role: 'Координатор волонтёров',
    image: '/images/team-4.svg',
  },
];

const partners = [
  { name: 'ВетЦентр "Здоровье"', type: 'Ветеринарная клиника' },
  { name: 'Зоомагазин "Дружок"', type: 'Магазин' },
  { name: 'Фонд "Помощь животным"', type: 'Благотворительный фонд' },
  { name: 'Корпорация "Добро"', type: 'Корпоративный партнёр' },
];

export default function About() {
  return (
    <div className="space-y-16 py-8">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">О ПриютПоиск</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Мы — команда единомышленников, объединённых одной целью: помочь бездомным животным найти тёплый дом и любящих хозяев.
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-amber-100 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-7 h-7 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Наша миссия</h2>
              <p className="text-gray-600">
                Сделать жизнь бездомных животных лучше, найти каждому из них любящий дом и сократить количество брошенных питомцев.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Наши цели</h2>
              <ul className="text-gray-600 space-y-2">
                <li>Помочь 1000+ животных найти дом</li>
                <li>Развивать культуру ответственного владения</li>
                <li>Создать сеть партнёрских приютов</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-7 h-7 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Наши ценности</h2>
              <ul className="text-gray-600 space-y-2">
                <li>Любовь к животным</li>
                <li>Ответственность и честность</li>
                <li>Открытость и прозрачность</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Наша команда</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Люди, которые каждый день работают над тем, чтобы помогать животным
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-white rounded-2xl shadow-lg overflow-hidden group">
              <div className="aspect-square overflow-hidden">
                <FallbackImage
                  src={member.image}
                  fallbackSrc="/images/team-1.svg"
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-amber-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Наши партнёры</h2>
              <p className="text-gray-600 mb-8">
                Мы сотрудничаем с организациями, которые разделяют наши ценности и готовы помогать бездомным животным.
              </p>
              <div className="space-y-4">
                {partners.map((partner) => (
                  <div key={partner.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <PawPrint className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{partner.name}</p>
                      <p className="text-sm text-gray-500">{partner.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Статистика</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-amber-600">500+</p>
                  <p className="text-gray-600 text-sm">Найдено домов</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-amber-600">50+</p>
                  <p className="text-gray-600 text-sm">Питомцев в приюте</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-amber-600">30+</p>
                  <p className="text-gray-600 text-sm">Партнёров</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-amber-600">1000+</p>
                  <p className="text-gray-600 text-sm">Волонтёров</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
