import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user.model';
import { Role } from '../../models/role.enum';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: UserModel[] = [];
  selectedUser: UserModel | null = null;
  constructor(private _userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }
  getUsers(): void {
    this.users = this._userService.getAllUsers();
  }

  selectUser(user: UserModel) {
    this.selectedUser = user;
  }
  updateUserRole(user: UserModel, newRole: Role) {
    const updatedRole = { ...user, role: newRole };
    this._userService.updateUser(user.id, updatedRole);
    this.getUsers();
    if (this.selectedUser && this.selectedUser.id === user.id) {
      this.selectedUser = { ...updatedRole };
    }
  }
}
