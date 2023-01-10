interface Order {
    id?: string;
    price: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    boat: string;
    color: string;
    radar: string;
    autopilot: string;
    battery: string;
    seaweed: boolean;
    bag: boolean;
    light: boolean;
    orderDate: Date | string;
    fulfilledDate: Date | string;
    warrantyDate: Date | string;
}
