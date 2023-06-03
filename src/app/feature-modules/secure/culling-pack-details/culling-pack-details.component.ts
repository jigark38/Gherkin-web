import { Component, OnInit } from '@angular/core';
import { CullingPackDetailsService } from './culling-pack-details.service';
import { OfficeLocation } from './culling-pack-details.models';

@Component({
  selector: 'app-culling-pack-details',
  templateUrl: './culling-pack-details.component.html',
  styleUrls: ['./culling-pack-details.component.css']
})
export class CullingPackDetailsComponent implements OnInit {

  constructor(private cullingPackDetailsService: CullingPackDetailsService) { }
  officeLocations: OfficeLocation[] = [];
  ngOnInit() {
    try {
      this.GetOfficeLocationDetails();
    } catch (error) {

    }
  }

  GetOfficeLocationDetails() {
    try {
      this.cullingPackDetailsService.GetOrgofficelocationDetails().subscribe((data: OfficeLocation[]) => {
        this.officeLocations = data;
      }, err => {

      });
    } catch (error) {

    }
  }

}
