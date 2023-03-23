/**
    @file HelloSphere.ts
    @brief A HelloSphere Class representing an entity. This is used for debugging purposes
*/
import { Entity, Sphere } from "../../core";

export class HelloSphere extends Entity{

    Init(): void{
        const sphere = this.AddComponent(Sphere);
    }

    Update(): void {}
}