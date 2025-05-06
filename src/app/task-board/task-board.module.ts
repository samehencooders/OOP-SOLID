import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';

// Angular Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';

// Routing
import { TaskBoardRoutingModule } from './task-board-routing.module';


import { TaskPlannerDashboardComponent } from './dashboard/dashboard.component';
import { AiAssistantComponent } from './ai-assistant/ai-assistant.component';
import { TaskBoardComponent } from './task-board/task-board.component';
import { TaskDetailComponent } from './task-detail-component/task-detail.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TaskFormComponent } from './task-form/task-form.component';

@NgModule({
  declarations: [
    TaskPlannerDashboardComponent,AiAssistantComponent,TaskBoardComponent,
    TaskDetailComponent,
    TaskFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    ScrollingModule,
    TaskBoardRoutingModule,

    // Angular Material
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDividerModule,
    MatToolbarModule,
    FormsModule,
  MatTabsModule

  ],
  exports: [],
})
export class TaskBoardModule {}
