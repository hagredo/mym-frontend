import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform{
  transform(value:string, limite:string) : string{
    let response = '';
    let limit = parseInt(limite);
    response = (value) ? (value.length > limit ? value.substring(0,limit)+"..." :   value) : '';
    return response;
  }
}
