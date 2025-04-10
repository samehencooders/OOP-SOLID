import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { Role } from '../models/role.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: UserModel[] = [
    new UserModel(1, 'user_1', 'example_1@gmail.com', Role.ADMIN, true),
    new UserModel(2, 'user_1', 'example_1@gmail.com', Role.ADMIN, true),
    new UserModel(3, 'Admin User', 'admin@example.com', Role.ADMIN, false),
    new UserModel(4, 'Editor User', 'editor@example.com', Role.EDITOR, false),
    new UserModel(5, 'Viewer User', 'viewer@example.com', Role.VIEWER, false),
  ];
  getAllUsers(): UserModel[] {
    return this.users;
  }
  getUserById(id: number): UserModel | undefined {
    return this.users.find((user) => user.id === id);
  }

  addUser(user: UserModel): void {
    this.users.push(user);
  }
  updateUser(id: number, user: Partial<UserModel>): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index > -1) {
      this.users[index] = { ...this.users[index], ...user };
    }
  }
  deleteUser(id: number): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
