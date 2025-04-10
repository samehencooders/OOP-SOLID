import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor'
})
export class StatusColorPipe implements PipeTransform {
  transform(status: string): string {
    switch (status.toLowerCase()) {
      case 'complete':
        return 'status completed';
      case 'inComplete':
        return 'status pending';
      case 'in-progress':
        return 'status in-progress';
      default:
        return 'status';
    }
  }
}
