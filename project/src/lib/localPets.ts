import type { Pet } from '../types';

export const LOCAL_PETS: Pet[] = [
  {
    id: 'local-1',
    name: 'Тузик',
    breed: 'Мопс',
    age: 2,
    gender: 'male',
    city: 'Сочи',
    description: 'Весёлый маленький пёс, любит бегать по пляжу и обожает лакомства.',
    image_url: '/images/local-dog-1.svg',
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
  },
  {
    id: 'local-2',
    name: 'Маруся',
    breed: 'Сибирская кошка',
    age: 3,
    gender: 'female',
    city: 'Новосибирск',
    description: 'Маруся спокойная и нежная, любит сидеть на коленях и слушать музыку.',
    image_url: '/images/local-cat-1.svg',
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
  },
  {
    id: 'local-3',
    name: 'Барни',
    breed: 'Лабрадор',
    age: 4,
    gender: 'male',
    city: 'Казань',
    description: 'Активный лабрадор, который любит парки и плавание.',
    image_url: '/images/local-dog-2.svg',
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
  },
  {
    id: 'local-4',
    name: 'Снежинка',
    breed: 'Британская кошка',
    age: 1,
    gender: 'female',
    city: 'Екатеринбург',
    description: 'Милая кошечка, которая любит мягкие игрушки и нежные обнимашки.',
    image_url: '/images/local-cat-2.svg',
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
  },
  {
    id: 'local-5',
    name: 'Пеппи',
    breed: 'Мопс',
    age: 2,
    gender: 'female',
    city: 'Сочи',
    description: 'Нежная мопсиха Пеппи любит прогулки и объятия, идеально подходит для уютной семьи.',
    image_url: '/images/local-dog-1.svg',
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
  },
  {
    id: 'local-6',
    name: 'Рыжик',
    breed: 'Дворняга',
    age: 3,
    gender: 'male',
    city: 'Ростов-на-Дону',
    description: 'Рыжий и ласковый пес, быстро находит общий язык с детьми и любит прогулки.',
    image_url: '/images/local-dog-2.svg',
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
  },
  {
    id: 'local-7',
    name: 'Лампочка',
    breed: 'Хаски',
    age: 2,
    gender: 'female',
    city: 'Москва',
    description: 'Активная хаски любит бег и снег, ей нужен хозяин, который любит прогулки.',
    image_url: '/images/local-dog-1.svg',
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
  },
  {
    id: 'local-8',
    name: 'Кнопка',
    breed: 'Рэгдолл',
    age: 1,
    gender: 'female',
    city: 'Санкт-Петербург',
    description: 'Мягкая и добрая кошечка, которая любит тихие вечера и ласковые руки.',
    image_url: '/images/local-cat-2.svg',
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
  },
];

export function filterLocalPets(options: {
  search?: string;
  breed?: string;
  city?: string;
  ageMin?: string;
  ageMax?: string;
  gender?: string;
}) {
  const { search, breed, city, ageMin, ageMax, gender } = options;
  return LOCAL_PETS.filter((pet) => {
    if (breed && breed !== 'Все породы' && pet.breed !== breed) return false;
    if (city && city !== 'Все города' && pet.city !== city) return false;
    if (gender && pet.gender !== gender) return false;
    if (ageMin && pet.age < parseInt(ageMin, 10)) return false;
    if (ageMax && pet.age > parseInt(ageMax, 10)) return false;

    const query = search?.trim().toLowerCase() || '';
    if (!query) return true;

    return (
      pet.name.toLowerCase().includes(query) ||
      pet.breed.toLowerCase().includes(query) ||
      pet.city.toLowerCase().includes(query)
    );
  });
}
