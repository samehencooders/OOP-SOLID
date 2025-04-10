import { Role } from './role.enum';
import { User } from './user.interface';

export class UserModel implements User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public role: Role,
    public isActive: boolean
  ) {}
//   isAdmin(): boolean {
//     return this.role === Role.ADMIN;
//   }
}
