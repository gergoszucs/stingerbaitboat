interface Order {
    id?: string;
    name: string;
    boat: string;
    orderDate: Date | string;
    fulfilledDate: Date | string;
    warrantyDate: Date | string;
}
