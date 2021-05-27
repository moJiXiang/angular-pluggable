declare type BindData = {
    [k: string]: any;
};
export declare class Event {
    name: string;
    data?: BindData;
    constructor(name: string, data?: BindData);
}
export declare class RenderderEvent extends Event {
    placement: string;
    constructor(name: string, placement: string);
}
export {};
