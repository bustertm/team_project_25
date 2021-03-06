import { Layer } from "./Layer";
import { BusinessElement } from "./BusinessElement";

export class Diagram extends BusinessElement {

    protected _id: number;
    protected _layers: Layer[] = [];

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    public get layers(): Layer[] {
        return this._layers;
    }

    public set layers(layers: Layer[]) {
        this._layers = layers;
    }

}