import { VendorType } from "../enum/EVendorType"

interface VendorProps {
    Id: number;
    Name: String;
    Password: String;
    Type: VendorType;
}

class Vendor {

    Id: number;
    Name: String;
    Password: String;
    Type: VendorType;


    public constructor(props: VendorProps) {
        this.Id = 0;
        this.Name = props.Name;
        this.Password = props.Password;
        this.Type = props.Type;
    }
}

export { Vendor}