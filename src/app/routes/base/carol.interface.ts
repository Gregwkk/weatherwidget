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

export {
  FilterOptions,
  FilterValues,
};
