import { Pipe, PipeTransform } from '@angular/core';

import { Albums } from '../_models/albums';

@Pipe({
    name: 'AlbumFilterPipe',
    pure: false
})
export class AlbumFilterPipe implements PipeTransform {
  transform(items: Albums[], filter: Albums): Albums[] {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: Albums) => this.applyFilter(item, filter));
  }
  
  /**
   * Perform the filtering.
   * 
   * @param {Albums} Albums The book to compare to the filter.
   * @param {Albums} filter The filter to apply.
   * @return {boolean} True if book satisfies filters, false if not.
   */
  applyFilter(Albums: Albums, filter: Albums): boolean {
    for (let field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (Albums[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (Albums[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }
}