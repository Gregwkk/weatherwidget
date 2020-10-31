import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { FilterOptions, FilterValues } from './carol.interface';
import { CarolService } from './carol.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html'
})
export class BaseComponent implements OnInit {
  disableFilters = true;
  constructor(
    private carolService: CarolService,
    private utilsService: UtilsService
  ) { }

  filterOptions = new FilterOptions();
  filters = new FilterValues();
  initialFilters = new FilterValues();
  firstTime = true;
  cidadeOptions: any;
  distance: number;
  cidadeLabel = 'Cidade';

  location: number[];


  ngOnInit() {
    this.getUserLocation().then(location => {
      this.fetchFilterOptions(location);
    });
  }

  private fetchFilterOptions(location, params?) {
    this.disableFilters = true;
    this.carolService.getFilterOptions(location, params).then((filterOptions: any) => {
      this.filterOptions = filterOptions.filterOptions;
      this.cidadeOptions = filterOptions.cidadeOptions;
      this.filters = filterOptions.inititalFilter;
      this.disableFilters = false;
    });
  }



  onChangeFilters(event?) {
    const params = this.prepareFilters();
    if (this.filters.cidade) {
      this.distance = this.cidadeOptions[this.filters?.uf][this.cidadeOptions[this.filters?.uf].findIndex(i => i.label === this.filters.cidade)].distance;
    } else { this.distance = 0; }
    this.cidadeLabel = `Cidade  -  ${this.utilsService.formatMetricDisplay(this.distance)}Km`;

    // this.fetchFilterOptions(location, params);
  }

  onChangeUF(event?) {

    // Esse script abaixo checa se a cidade existe dentro do estado, se existir ele não zera o valor
    if (this.filters.uf) {
      const checkArray = [];
      Object.values(this.cidadeOptions[`${this.filters?.uf}`]).forEach((element: any) => {
        checkArray.push(element.label);
      });


      if (!(checkArray.indexOf(this.filters.cidade) > -1)) {
        this.filters.cidade = null;
      }
    } else { this.filters.cidade = null; }
    this.onChangeFilters();
  }

  private prepareFilters() {

    const keys = Object.keys(this.filters);
    const values = Object.values(this.filters);
    const preparedFilters: any = {};

    values.forEach((value, index) => {
      if (value && value?.length) {
        preparedFilters[keys[index]] = value;
      }
    });

    return preparedFilters;
  }

  onResetFilters() {
    this.filters = new FilterValues;
    this.onChangeFilters();
  }

  private async getUserLocation() {
    const promise = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        this.location = [position.coords.latitude, position.coords.longitude]
        resolve([position.coords.latitude, position.coords.longitude]);
      }, function () {
        resolve('User Location not allowed');
      }, { timeout: 10000 });
    });

    return await promise;
  }

}