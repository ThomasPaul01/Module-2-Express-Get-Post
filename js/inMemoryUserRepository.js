// Chaque objet contient un utilisateur avec son login et mot de passe.
const registeredUsers = [
  { login: 'user1', password: 'pass1' },
  { login: 'user2', password: 'pass2' },
  { login: 'user3', password: 'pass3' },
];
export const authenticatedUsers = {};
export function getRegisteredUsers () {
    return registeredUsers;
}
export function checkCredentials (login, password) {
    return registeredUsers.some(user => user.login === login && user.password === password);
}

export function newUserRegistered(login, password) {
  if (!login || !password) return false;
  const exists = registeredUsers.some(user => user.login === login);
  if (exists) return false;
  registeredUsers.push({ login, password });
  return true;
}
