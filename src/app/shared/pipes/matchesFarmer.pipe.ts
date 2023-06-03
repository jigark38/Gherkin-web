import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'matchesFarmer',
    pure: false
})
@Injectable()
export class MathcesFarmerPipe implements PipeTransform {
    transform(items: Array<any>, farmerCode: string, cropNameCode: string): Array<any> {
        return items.filter(item => item.farmerCode === farmerCode && item.cropNameCode === cropNameCode);
    }
}
