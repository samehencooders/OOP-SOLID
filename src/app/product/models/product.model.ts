export class Product {
  constructor(
    public id: number,
    public name: string,
    private _price: number,
    public description: string
  ) {}
  get price() {
    return this._price;
  }
  set price(value: number) {
    if (value < 0) {
      throw new Error('Price cannot be negative');
    }
    this._price = value;
  }
}
