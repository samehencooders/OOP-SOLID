import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priorityColor'
})
export class PriorityColorPipe implements PipeTransform {
  transform(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'priority high';
      case 'medium':
        return 'priority medium';
      case 'low':
        return 'priority low';
      default:
        return 'priority';
    }
  }
}
