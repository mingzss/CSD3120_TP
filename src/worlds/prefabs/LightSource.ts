/**
    The LightSource class extends Entity and adds a PointLightSource component to it.
*/
import { Entity, PointLightSource } from "../../core";

export class LightSource extends Entity{

    /** The PointLightSource component of this LightSource. */
    m_PointLightSource: PointLightSource;

    /**
     * Initializes the LightSource by adding a PointLightSource component to it.
     */
    Init(): void {
        this.m_PointLightSource = this.AddComponent(PointLightSource);
    }

    /**
     * The Update method of the LightSource. Does nothing in this implementation.
     */
    Update(): void{

    }
}