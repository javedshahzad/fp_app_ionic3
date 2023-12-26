import { Pipe, PipeTransform,Injectable} from '@angular/core';

@Pipe({
  name: 'filter'
})
@Injectable()
export class FilterPipe implements PipeTransform {
 transform(items: any, term: any): any {
    if (term === undefined) return items;

    return items.filter(function(item) {
      for(let property in item){
        
        if (item[property] === null){
          continue;
        }
        if(item[property].toString().toLowerCase().includes(term.toLowerCase())){
          return true;
        }
         if(property ='outlet'){
           if(item[property].name.toString().toLowerCase().includes(term.toLowerCase())){
           console.log(item[property].name);
          return true;
         }
         
        }
         if(property ='roles'){
         if (item[property].filter(e => e.name === term.toLowerCase()).length > 0) {
          return true;
         }
         
        }
       }
      return false;
    });
  }

}