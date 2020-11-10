import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { FilterOptions, FilterValues, WeatherItem } from './carol.interface';
import { CarolService } from './carol.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html'
})
export class BaseComponent implements OnInit {
  disableFilters = true;
  refreshingData = true;
  weatherData: WeatherItem;
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
  cidadeLabel = 'Município';
  userDeniedLocation = false;

  location: number[];


  ngOnInit() {
    this.getUserLocation().then((location: Number[]) => {
      if (location[0] === 0 && location[1] === 0) { this.userDeniedLocation = true; } else { this.userDeniedLocation = false; }
      this.fetchFilterOptions(location);
    });
  }

  private fetchFilterOptions(location, params?) {
    this.disableFilters = true;
    this.carolService.getFilterOptions(location, params).then((filterOptions: any) => {
      this.filterOptions = filterOptions.filterOptions;
      this.cidadeOptions = filterOptions.cidadeOptions;
      this.filters = filterOptions.inititalFilter;
      this.fetchWeatherData();
      this.disableFilters = false;
    });
  }

  private fetchWeatherData() {
    this.refreshingData = true;
    const params = this.prepareFilters();
    this.carolService.getWeatherData(params).then(
      ({ weatherData }) => {
        this.weatherData = weatherData;
        // console.log(this.weatherData);
        this.refreshingData = false;
      }
    );
  }



  onChangeFilters(event?) {
    const params = this.prepareFilters();
    // Pega a distancia da cidade para mostrar no label do filtro
    if (this.filters.cidade) {
      this.distance = this.cidadeOptions[this.filters?.uf][this.cidadeOptions[this.filters?.uf].findIndex(i => i.label === this.filters.cidade)].distance;
    } else { this.distance = 0; }
    if (!this.userDeniedLocation) {
      this.cidadeLabel = `Município  -  ${this.utilsService.formatMetricDisplay(this.distance)}Km`;
    }
    // só chama a query se tiver cidade selecionada
    if (this.filters?.cidade?.length && !this.refreshingData) {
      this.fetchWeatherData();
    }
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
        resolve([0, 0]);
      }, { timeout: 10000 });
    });

    return await promise;
  }

}
