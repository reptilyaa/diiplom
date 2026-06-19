-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Pets table
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT DEFAULT 'unknown',
  city TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stories table
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adoption requests table
CREATE TABLE adoption_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (contact form)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pet_id)
);

-- Enable RLS on all tables
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pets (readable by all, editable by authenticated users)
CREATE POLICY "pets_select" ON pets FOR SELECT TO authenticated USING (true);
CREATE POLICY "pets_select_anon" ON pets FOR SELECT TO anon USING (true);
CREATE POLICY "pets_insert" ON pets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "pets_update" ON pets FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "pets_delete" ON pets FOR DELETE TO authenticated USING (true);

-- RLS Policies for stories (readable by all)
CREATE POLICY "stories_select" ON stories FOR SELECT TO authenticated USING (true);
CREATE POLICY "stories_select_anon" ON stories FOR SELECT TO anon USING (true);
CREATE POLICY "stories_insert" ON stories FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for adoption_requests (users manage their own)
CREATE POLICY "adoption_requests_select" ON adoption_requests FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "adoption_requests_insert" ON adoption_requests FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "adoption_requests_update" ON adoption_requests FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "adoption_requests_delete" ON adoption_requests FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for messages (anyone can send)
CREATE POLICY "messages_insert" ON messages FOR INSERT
  TO authenticated WITH CHECK (true);
CREATE POLICY "messages_insert_anon" ON messages FOR INSERT
  TO anon WITH CHECK (true);

-- RLS Policies for favorites (users manage their own)
CREATE POLICY "favorites_select" ON favorites FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert" ON favorites FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete" ON favorites FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Insert sample pets
INSERT INTO pets (name, breed, age, gender, city, description, image_url) VALUES
('Барсик', 'Персидская кошка', 3, 'male', 'Москва', 'Ласковый и спокойный кот. Любит отдыхать на диване и играть с игрушками. Отлично ладит с детьми.', 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Рекс', 'Немецкая овчарка', 2, 'male', 'Санкт-Петербург', 'Активный и умный пёс. Знает базовые команды. Требует много движения и тренировок.', 'https://images.pexels.com/photos/158682/german-shepherd-dog-animal-pet-158682.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Мурка', 'Сибирская кошка', 1, 'female', 'Новосибирск', 'Игривая и любопытная кошечка. Любит исследовать каждый уголок дома.', 'https://images.pexels.com/photos/1579663/pexels-photo-1579663.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Чарли', 'Золотистый ретривер', 4, 'male', 'Екатеринбург', 'Дружелюбный и преданный пёс. Обожает детей и длительные прогулки в парке.', 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Снежок', 'Британская кошка', 2, 'male', 'Казань', 'Спокойный и независимый кот. Идеален для занятых людей.', 'https://images.pexels.com/photos/96428/pexels-photo-96428.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Луна', 'Хаски', 3, 'female', 'Краснодар', 'Энергичная и общительная собака. Нуждается в активных прогулках и внимании.', 'https://images.pexels.com/photos/38560/ice-husky-sled-dogs-38560.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Тиша', 'Мейн-кун', 5, 'female', 'Самара', 'Крупная и пушистая кошка с добрым характером. Любит ласку и внимание.', 'https://images.pexels.com/photos/177809/pexels-photo-177809.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Бобик', 'Дворняга', 7, 'male', 'Воронеж', 'Верный и благодарный пёс. Спасён с улицы, очень привязан к людям.', 'https://images.pexels.com/photos/43467/pexels-photo-43467.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Пушок', 'Рэгдолл', 1, 'male', 'Нижний Новгород', 'Нежный котёнок, который обожает сидеть на руках. Очень ласковый.', 'https://images.pexels.com/photos/2194261/pexels-photo-2194261.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Джесси', 'Лабрадор', 2, 'female', 'Ростов-на-Дону', 'Весёлая и активная собака. Отличный компаньон для семьи с детьми.', 'https://images.pexels.com/photos/2820134/pexels-photo-2820134.jpeg?auto=compress&cs=tinysrgb&w=600');

-- Insert sample stories
INSERT INTO stories (pet_id, title, content, image_url) VALUES
((SELECT id FROM pets WHERE name = 'Барсик'), 'Барсик нашёл дом', 'Барсик провёл два года в приюте, прежде чем его заметила семья Ивановых. Теперь он живёт в уютной квартире, спит на мягком диване и каждый день получает порцию ласки. Его новые владельцы говорят, что он стал душой их дома.', 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=600'),
((SELECT id FROM pets WHERE name = 'Рекс'), 'Герой Рекс', 'Рекс был найден щенком на улице. После адаптации он стал настоящим членом семьи Петровых. Он охраняет дом, играет с детьми и сопровождает хозяина на пробежках каждое утро.', 'https://images.pexels.com/photos/158682/german-shepherd-dog-animal-pet-158682.jpeg?auto=compress&cs=tinysrgb&w=600'),
((SELECT id FROM pets WHERE name = 'Джесси'), 'Джесси: от приюта до любимца', 'Джесси попала к нам маленьким щенком. Теперь это счастливая собака, которая встречает своих хозяев с работы каждый день. Она приносит столько радости в дом!', 'https://images.pexels.com/photos/2820134/pexels-photo-2820134.jpeg?auto=compress&cs=tinysrgb&w=600');