import { Product } from "./Product";
import { TransactionType } from "./TransactionType";
import { Vendor } from "./Vendor";

interface TransactionProps {
    TransactionTypeId: number;
    TransactionType: TransactionType;
    MadeAt: Date;
    ProductId: number;
    Product: Product;
    VendorId: number;
    Vendor: Vendor;
    Price: number;
}

class Transaction {
    Id: number;
    TransactionTypeId: number;
    TransactionType: TransactionType;
    MadeAt: Date;
    ProductId: number;
    Product: Product;
    VendorId: number;
    Vendor: Vendor;
    Price: number;

    constructor(props: TransactionProps) {
        this.Id = 0;
        this.MadeAt = props.MadeAt;
        this.Price = props.Price;
        this.Product = props.Product;
        this.ProductId = props.ProductId;
        this.TransactionType = props.TransactionType
        this.TransactionTypeId = props.TransactionTypeId
        this.Vendor = props.Vendor
        this.VendorId = props.VendorId
    }
}


export { Transaction }