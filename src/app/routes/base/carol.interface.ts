interface FilterOptions {
  cidade?: FilterOption[];
  uf?: FilterOption[];
}

interface FilterOption {
  label: string;
  value: string;
}

class FilterOptions {
  constructor() {
    this.cidade = [];
    this.uf = [];
  }
}

interface FilterValues {
  cidade?: string;
  uf?: string;
}

class FilterValues {
  constructor() {
    this.cidade;
    this.uf;
  }
}

interface WeatherItem {
  gonnaRain?: String;
  minimumtemperature?: Number;
  maximumtemperature?: Number;
  precipitation?: Number;
  dataprevisao?: String;
  diaDaSemana?: String;
  dia?: String;
  mes?: String;
  uf?: String;
  cidade?: Date;
  lat_lng?: String;
}

export {
  FilterOptions,
  FilterValues,
  WeatherItem
};
