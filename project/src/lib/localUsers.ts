interface LocalUser {
  id: string;
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
  created_at: string;
}

const STORAGE_KEY = 'priut_local_users';
const SESSION_KEY = 'priut_session';

export function getLocalUsers(): LocalUser[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveLocalUsers(users: LocalUser[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function registerLocalUser(email: string, password: string): { success: boolean; error?: string } {
  const users = getLocalUsers();
  
  if (users.some(u => u.email === email)) {
    return { success: false, error: 'already registered' };
  }

  const newUser: LocalUser = {
    id: `local_${Date.now()}`,
    email,
    password,
    name: '',
    isAdmin: false,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  saveLocalUsers(users);
  
  return { success: true };
}

export function ensureLocalAdmin(email: string, password: string): void {
  const users = getLocalUsers();
  const adminUser = users.find((u) => u.isAdmin);
  if (adminUser) {
    return;
  }

  const existing = users.find((u) => u.email === email);
  if (existing) {
    existing.password = password;
    existing.isAdmin = true;
    existing.name = existing.name || 'Админ';
  } else {
    users.push({
      id: `local_${Date.now()}`,
      email,
      password,
      name: 'Админ',
      isAdmin: true,
      created_at: new Date().toISOString(),
    });
  }

  saveLocalUsers(users);
}

export function loginLocalUser(email: string, password: string): { success: boolean; user?: LocalUser; error?: string } {
  const users = getLocalUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  setLocalSession(user);
  return { success: true, user };
}

export function updateLocalUserName(userId: string, name: string): { success: boolean; error?: string } {
  const users = getLocalUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  user.name = name;
  saveLocalUsers(users);

  const session = getLocalSession();
  if (session?.id === userId) {
    setLocalSession(user);
  }

  return { success: true };
}

export function updateLocalUserPassword(userId: string, currentPassword: string, newPassword: string): { success: boolean; error?: string } {
  const users = getLocalUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  if (user.password !== currentPassword) {
    return { success: false, error: 'Invalid credentials' };
  }

  user.password = newPassword;
  saveLocalUsers(users);

  const session = getLocalSession();
  if (session?.id === userId) {
    setLocalSession(user);
  }

  return { success: true };
}

export function getLocalSession(): LocalUser | null {
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function setLocalSession(user: LocalUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearLocalSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
