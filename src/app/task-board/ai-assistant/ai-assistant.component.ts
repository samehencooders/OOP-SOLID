import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AiService } from '../../services/ai.service';
import { Task } from '../../models/task.model';
import { Workflow } from '../../models/workflow.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ai-assistant',
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.scss']
})
export class AiAssistantComponent implements OnInit {
  aiForm!: FormGroup;
  loading = false;
  aiResponse: any = null;
  activeFeature: string = 'task-creation';
  objectKeys = Object.keys;
  
  constructor(
    private fb: FormBuilder,
    private aiService: AiService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.aiForm = this.fb.group({
      naturalLanguageInput: ['', Validators.required],
      taskId: [''],
      workflowId: [''],
      projectType: ['']
    });
  }

  onFeatureSelect(feature: string): void {
    this.activeFeature = feature;
    this.aiResponse = null;
    this.initForm();
  }

  getFeatureTitle(feature: string): string {
    switch (feature) {
      case 'task-completion': return 'Predict Task Completion Time';
      case 'suggest-assignee': return 'Suggest Task Assignee';
      case 'generate-checklist': return 'Generate Task Checklist';
      case 'analyze-risk': return 'Analyze Task Risk';
      case 'analyze-bottlenecks': return 'Analyze Workflow Bottlenecks';
      case 'suggest-wip-limits': return 'Suggest WIP Limits';
      case 'project-summary': return 'Generate Project Summary';
      default: return '';
    }
  }

  submitRequest(): void {
    this.loading = true;
    this.aiResponse = null;
    
    const formValue = this.aiForm.value;
    
    let request$: Observable<any>;
    
    switch (this.activeFeature) {
      case 'task-creation':
        request$ = this.aiService.processNaturalLanguageTask(formValue.naturalLanguageInput);
        break;
      case 'workflow-template':
        request$ = this.aiService.generateWorkflowTemplate(formValue.projectType);
        break;
      case 'task-completion':
        request$ = this.aiService.predictTaskCompletionTime(formValue.taskId);
        break;
      case 'suggest-assignee':
        request$ = this.aiService.suggestAssignee(formValue.taskId);
        break;
      case 'generate-checklist':
        request$ = this.aiService.generateChecklist(formValue.taskId);
        break;
      case 'analyze-bottlenecks':
        request$ = this.aiService.analyzeWorkflowBottlenecks(formValue.workflowId);
        break;
      case 'suggest-wip-limits':
        request$ = this.aiService.suggestWipLimits(formValue.workflowId);
        break;
      case 'analyze-risk':
        request$ = this.aiService.analyzeTaskRisk(formValue.taskId);
        break;
      case 'project-summary':
        request$ = this.aiService.generateProjectSummary(formValue.workflowId);
        break;
      default:
        this.loading = false;
        return;
    }
    
    request$.subscribe({
      next: (response) => {
        this.aiResponse = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error from AI service:', error);
        this.aiResponse = { error: 'Failed to process request. Please try again.' };
        this.loading = false;
      }
    });
  }
}