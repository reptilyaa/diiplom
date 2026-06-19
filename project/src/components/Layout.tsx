import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Heart, User, LogOut, Home, PawPrint, BookOpen, Users, Mail } from 'lucide-react';

export default function Layout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/pets', label: 'Питомцы', icon: PawPrint },
    { to: '/stories', label: 'Истории', icon: BookOpen },
    { to: '/about', label: 'О нас', icon: Users },
    { to: '/contact', label: 'Контакты', icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors">
                <PawPrint className="w-8 h-8" />
                <span className="text-xl font-bold">ПриютПоиск</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'text-amber-600 bg-amber-100'
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <Home className="w-4 h-4" />
                Главная
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'text-amber-600 bg-amber-100'
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Профиль
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors"
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-4">
              <div className="flex flex-col gap-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'text-amber-600 bg-amber-100'
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  Главная
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.to)
                        ? 'text-amber-600 bg-amber-100'
                        : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-gray-100 mt-2 pt-4">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        Профиль
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-3 w-full text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Выйти
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        Войти
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 mt-2 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-center justify-center"
                      >
                        Регистрация
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="min-h-screen">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 text-amber-400 mb-4">
                <PawPrint className="w-8 h-8" />
                <span className="text-xl font-bold">ПриютПоиск</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Мы помогаем бездомным животным найти тёплый дом и любящих хозяев. Каждое животное заслуживает шанс на счастье.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Навигация</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-gray-400 hover:text-amber-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Контакты</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@dobrodom.ru</li>
                <li>+7 (999) 123-45-67</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>2026 ПриютПоиск. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
