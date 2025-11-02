export interface User {
  id: number;
  name: string;
  email: string;
}

export type UserId = number;

export function getUserById(id: UserId): User | null {
  return null;
}

export class UserService {
  findUser(id: number): User | null {
    return null;
  }
}
