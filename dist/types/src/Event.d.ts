export declare class Event {
    name: string;
    constructor(name: string);
}
export declare class RenderderEvent extends Event {
    placement: string;
    constructor(name: string, placement: string);
}
