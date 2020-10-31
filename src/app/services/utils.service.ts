import { Injectable, isDevMode } from '@angular/core';

import * as configs from '../../../proxy.conf.json';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private objConnectors: any;

  getConnectorIdDefault(): string {
    return configs['connectorId'];
  }

  getApplicationId(): string {
    return this.getConnectors().applicationId;
  }

  getConnectorId(): string {
    return this.getConnectors().applicationIdInputConnector;
  }

  getAppIdInputConnStudentRetention(): string {
    return this.getConnectors().applicationIdInputConnStudentRetention;
  }

  getEnvironment(): string {
    if (isDevMode()) {
      return configs['environment'];
    } else {
      const environment = window.location.pathname.split('/')[1];
      return environment === 'apps' ? window.location.host.split('.')[0] : environment;
    }
  }

  getOrganization(): string {
    if (isDevMode()) {
      return configs['organization'];
    } else {
      const organization = window.location.host.split('.')[0];
      const environment = window.location.pathname.split('/')[1];
      return environment === 'apps' ? null : organization;
    }
  }

  private getConnectors() {
    if (!this.objConnectors) {
      this.objConnectors = JSON.parse(localStorage.getItem('Connectors'));
    }

    return this.objConnectors;
  }

  toTitleCase(str) {
    return str.toLowerCase().replace(/^(.)|\s(.)/g,
      function ($1) { return $1.toUpperCase(); });
  }

  roundTo2Digits(value = 0){
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }


  formatToDisplay(value = 0) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  formatToDisplay2Digits(value = 0) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatToDisplay4Digits(value = 0) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  }

  formatMetricDisplay(value = 0) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  formatToAbbreviation(value) {
    if (value > 999999) {
      return (value / 1000000).toFixed(1).toLocaleString() + 'M';
    } else {
      return (value / 1000).toFixed(1).toLocaleString() + 'k';
    }
  }
}
