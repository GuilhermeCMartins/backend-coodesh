interface ProductProps {
    Name: String;
    Description: String;
    Quantity: Number;
    Price: Number;
}

class Product {

    Id: Number;
    Name: String;
    Description: String;
    Price: Number;
    Quantity: Number

    constructor(props: ProductProps) {
        this.Id = 0;
        this.Name = props.Name
        this.Description = props.Description
        this.Price = props.Price
        this.Quantity = props.Quantity
    }
}

export { Product }