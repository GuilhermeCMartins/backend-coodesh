import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

function isValidData(type: string, date: string, product: string, value: Decimal, vendor: string) {
    const errors = [];

    if (!['1', '2', '3', '4'].includes(type)) {
        errors.push('Invalid type: ' + type);
    }

    if (!isValidISODate(date)) {
        errors.push('Invalid date: ' + date);
    }

    if (product.trim().length === 0) {
        errors.push('Product description is empty: ' + product);
    }

    const parsedValue = Number(value);
    if (isNaN(parsedValue) || parsedValue <= 0) {
        errors.push('Invalid value: ' + value);
    }

    if (vendor.trim().length === 0) {
        errors.push('Vendor name is empty: ' + vendor);
    }

    return errors;
}


function isValidISODate(dateString: string) {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-\d{2}:\d{2}$/;
    return isoDateRegex.test(dateString);
}

function formatValueToReal(valueString: string) {
    const value = Number(valueString) / 100;
    const decimalValue = new Prisma.Decimal(value.toString());
    return decimalValue;
}


export {
    isValidData,
    formatValueToReal
}