import { OccurenceSpecification } from "./OccurenceSpecification"
import { Layer } from "./Layer";
enum kinds { "complete", "lost", "found", "unknown" };
enum sorts { "synchCall", "asynchCall", "asynchSignal", "createMessage", "deleteMessage", "reply" };

export class Message{

    name: string;
    sort: sorts;
    kind: kinds;
    start: OccurenceSpecification;
    end: OccurenceSpecification;

    public get parentLayer(): Layer {
        return this.start.at.layer;
    }

    constructor(name:string,sort:sorts,kind:kinds,start:OccurenceSpecification,end:OccurenceSpecification){
        this.name = name;   
        this.kind = kind;
        this.sort = sort;
        this.start = start;
        this.end = end;
    }

    
}

