import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { FilterOptions } from './carol.interface';
import haversine from 'haversine-distance';

@Injectable({
  providedIn: 'root'
})
export class CarolService {

  constructor(
    private http: HttpClient,
  ) { }

  getFilterOptions(location, params) {
    return new Promise((res) => {
      let initialDistance = 9999999999;
      let inititalFilter = { uf: 'BA', cidade: 'Barreiras' };
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
        }
      );
    });
  }
}
