import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | ConvertSize
 * Example:
 *   {{ 2 | ConvertSize }}
 *   formats to: 1024
*/
@Pipe({name: 'ConvertSize'})
export class ConvertSize implements PipeTransform {
  transform(value: number): string {
    if (typeof value === 'undefined' || value === 0) {
      return '';
    } else {
      return value < 1024000 ?
            (value / 1024).toFixed(0) + ' KB' : (value / 1024000).toFixed(0) + ' MB';
    }
  }
}
