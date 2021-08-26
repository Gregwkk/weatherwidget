import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilterOptions, WeatherItem } from './carol.interface';
import haversine from 'haversine-distance';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CarolService {

  constructor(
    private http: HttpClient,
  ) { }

  getWeatherData(params) {
    const sortBy = 'dataprevisao';
    const pageSize = 30;
    return new Promise((resolvePromise) => {
      this.http.post(`/api/v3/queries/named/weatherData?indexType=MASTER&sortBy=mdmGoldenFieldAndValues.${sortBy}&sortOrder=ASC&pageSize=${pageSize}`, params).subscribe(
        (response: any) => {
          resolvePromise({
            weatherData: this.prepareWeatherData(response.hits.map(i => i.mdmGoldenFieldAndValues)),
          });
        }
      );
    });
  }

  private prepareWeatherData(mdmGoldenFieldAndValues) {



    return mdmGoldenFieldAndValues.map((item): WeatherItem => ({
      gonnaRain: item.precipitation ? 'wi wi-rain' : 'wi wi-day-sunny',
      minimumtemperature: item.minimumtemperature,
      maximumtemperature: item.maximumtemperature,
      precipitation: item.precipitation,
      dataprevisao: moment(item.dataprevisao).format('dddd, DD [de] MMMM [de] YYYY'),
      diaDaSemana: moment(item.dataprevisao).format('dddd'),
      dia: moment(item.dataprevisao).format('DD'),
      mes: moment(item.dataprevisao).format('MMM'),
      uf: item.uf,
      cidade: item.cidade,
      lat_lng: item.lat_lng

    }));
  }

  getFilterOptions(location, params) {
    return new Promise((res) => {
      let initialDistance = 9999999999;
      let inititalFilter = { uf: 'MT', cidade: 'Lucas do Rio Verde' };
      this.http.post('/api/v3/queries/named/weatherFilters?indexType=MASTER&pageSize=0&scrollable=false', params).subscribe(
        (response: any) => {

          // Pega filtros padrões
          const filterOptions: any = new FilterOptions();
          const keys = Object.keys(response.aggs);
          Object.values(response.aggs).forEach(({ buckets }, index) => {
            filterOptions[keys[index]] = Object.values(buckets).filter((b: any) => b.key.length).map((b: any) => ({
              label: b.key,
              value: b.key
            }));
          });

          // Ordena em ordem alfabética
          Object.keys(filterOptions).forEach((key, index) => {
            filterOptions[key].sort(function (a, b) {
              const textA = a.label.toUpperCase();
              const textB = b.label.toUpperCase();
              return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
          });

          // coloca opções de cidade dentro de cada estado
          const cidadeOptions = {};
          const cidadeKeys = Object.keys(response.aggs.uf.buckets);
          Object.values(response.aggs.uf.buckets).forEach((buckets: any, index) => {
            // tslint:disable-next-line: max-line-length
            cidadeOptions[cidadeKeys[index]] = Object.values(buckets.aggregations.cidade.buckets).filter((b: any) => b.key.length).map((b: any) => ({
              label: b.key,
              value: b.key,
              distance: getDistance(buckets, b)
            }));
          });

          console.log('cidade',cidadeOptions)

          function getDistance(estado, cidade) {
            const lat_lng: string = cidade.aggregations.lat_lng.buckets[Object.keys(cidade.aggregations.lat_lng.buckets)[0]].key;
            const geoPoint = { lat: Number(lat_lng.split(',')[0]), lng: Number(lat_lng.split(',')[1]) };
            const locationPoint = { lat: location[0], lng: location[1] };
            const distance = (haversine(geoPoint, locationPoint)) / 1000;
            if (initialDistance > distance) {
              initialDistance = distance;
              inititalFilter = { uf: estado.key, cidade: cidade.key };
            }

            return distance;


          }



          res({ filterOptions: filterOptions, cidadeOptions: cidadeOptions, inititalFilter: inititalFilter });
          console.log('initial',inititalFilter)
          console.log('Filter Optons',filterOptions)

        }
      );
    });
  }
}
