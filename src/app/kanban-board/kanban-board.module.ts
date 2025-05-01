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
import { KanbanBoardRoutingModule } from './kanban-board-routing.module';

// Components
import { KanbanBoardComponent } from './pages/kanban-board/kanban-board.component';
import { TaskModalComponent } from './modals/task-modal/task-modal.component';
import { WipLimitDialogComponent } from './modals/wip-limit-dialog/wip-limit-dialog.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';

@NgModule({
  declarations: [KanbanBoardComponent, TaskModalComponent,WipLimitDialogComponent,
    TaskDetailsComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    ScrollingModule,
    KanbanBoardRoutingModule,

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

  ],
  exports: [KanbanBoardComponent,TaskDetailsComponent],
})
export class KanbanBoardModule {}
