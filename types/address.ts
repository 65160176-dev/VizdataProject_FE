export interface Address {
    _id: string;
    userId: string;
    name: string;
    phone: string;
    address: string;
    subDistrict: string;
    district: string;
    province: string;
    zipCode: string;
    isDefault: boolean;
}

export interface CreateAddressPayload {
    name: string;
    phone: string;
    address: string;
    subDistrict: string;
    district: string;
    province: string;
    zipCode: string;
    isDefault?: boolean;
}