import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Role } from '../../models/role.enum';

@Component({
  selector: 'app-role-selector',
  templateUrl: './role-selector.component.html',
  styleUrls: ['./role-selector.component.scss'],
})
export class RoleSelectorComponent implements OnInit {
  @Input() selectedRole: Role | null = null;
  @Output() roleChange = new EventEmitter<Role>();
  roles = Object.values(Role);
  constructor() {}

  ngOnInit(): void {}
  selectRole(role: any) {
    this.selectedRole = role.value;
    this.roleChange.emit(role.value);
  }
}
