import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { RoleSelectorComponent } from './components/role-selector/role-selector.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { RouterModule } from '@angular/router';
const router = [
  {
    path: '',
    component: UserListComponent,
  },
];
@NgModule({
  declarations: [UserListComponent, RoleSelectorComponent, UserDetailComponent],
  exports: [UserListComponent, UserDetailComponent, RoleSelectorComponent],

  imports: [CommonModule, RouterModule.forChild(router)],
})
export class UserModule {}
