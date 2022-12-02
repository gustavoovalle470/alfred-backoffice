import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class DateUtil {

    pipe = new DatePipe('es-ES');
    
    formatDate(date : Date, format: string) : string{
        return this.pipe.transform(date, format);
    }

    daysBetweenToDates(lowerDate, highestDate){
        var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
        var utc1 = Date.UTC(lowerDate.getFullYear(), lowerDate.getMonth(), lowerDate.getDate());
        var utc2 = Date.UTC(highestDate.getFullYear(), highestDate.getMonth(), highestDate.getDate());
        return Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);
      }
}
