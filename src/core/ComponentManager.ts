/**
    @file ComponentManager.ts
    @brief A ComponentManager class that manages components within the entity component system
*/
import { Component } from "./Components/Component";
import { Entity } from "./Entity";
import {Scene} from "babylonjs"

// Abstract class that defines the interface for component arrays
abstract class IComponentArray{
    m_Scene: Scene;
    constructor(
        scene: Scene
    ){
        this.m_Scene = scene;
    }

    public abstract RemoveEntity(entity: Entity) : void;
}

// Concrete implementation of the component array class
class ComponentArray<T extends Component> extends IComponentArray{
    // Map that holds an array of components for each entity
    m_ComponentList = new Map<Entity, T[]>()

    // Method that returns a component of a certain type and index for a given entity, or null if it doesn't exist
    public GetComponent(entity: Entity, index: number) : T | null{
        if (this.m_ComponentList.has(entity)){
            if (index < this.m_ComponentList.get(entity)!!.length)
                return this.m_ComponentList.get(entity)!![index];
        }
        return null;
    }

    // Method that adds a new component of a certain type to a given entity and returns the new component
    public AddComponent(entity: Entity, componentClass: { new(...args: any[]): T ;}) : T{
        // Determine the index of the new component in the entity's list of components
        let index = this.m_ComponentList.get(entity) == null? 0 : this.m_ComponentList.get(entity)!!.length;
        // Create a new component object with the given class and arguments
        let args = [entity.m_Name + componentClass.name + index, this.m_Scene, entity, index];
        const component = new componentClass(...args);
        // Initialize the component
        component.Init();
        // Add the component to the entity's list of components
        if (!this.m_ComponentList.has(entity)){
            this.m_ComponentList.set(entity, [component]);
        }
        else {
            this.m_ComponentList.get(entity)!!.push(component);
        }
        // Return the new component
        return component;
    }

    // Method that removes a component of a certain type and index from a given entity
    public RemoveComponent(entity: Entity, index: number){
        if (this.m_ComponentList.has(entity)){
            if (index < this.m_ComponentList.get(entity)!!.length)
            {
                // Cleanup the component before removing it
                this.m_ComponentList.get(entity)!![index].Cleanup();
                // Remove the component from the entity's list of components
                this.m_ComponentList.get(entity)!!.splice(index, 1);
            }
        }
    }

    // Method that removes all components associated with a given entity
    public override RemoveEntity(entity: Entity){
        if (this.m_ComponentList.has(entity)){
            // Cleanup all components associated with the entity
            const T_Array = this.m_ComponentList.get(entity)!!;
            for (let i = 0; i < T_Array.length; ++i){
                T_Array[i].Cleanup();
            }
            // Remove the entity from the component array's list of entities
            this.m_ComponentList.delete(entity);
        }
    }
}

// ComponentManager responsible for managing components
export class ComponentManager{

    // Class properties
    m_Scene: Scene;
    m_ComponentArrays = new Map<string, IComponentArray>;

    // This is the constructor function that will be called when creating an instance of the class
    constructor(
        scene: Scene
    ){
        this.m_Scene = scene;
    }

    // This is a function that returns a component array based on the component type name
    GetComponentArray<T extends Component>(typeName: string) : ComponentArray<T>
    {
        // This line gets the component array based on the type name and casts it as a ComponentArray<T> object
        return (this.m_ComponentArrays.get(typeName)!!) as ComponentArray<T>
    }

    // This is a function that adds a component of a certain type to an entity
    AddComponent<T extends Component>(entity: Entity, componentClass: { new(...args: any[]): T ;}) : T
    {
        // This line gets the type name of the component class
        let typeName = componentClass.name;

        // This block checks if there is already a component array for the type, and if not, creates a new one
        if (!this.m_ComponentArrays.has(typeName))
        {
            this.m_ComponentArrays.set(typeName, new ComponentArray<T>(this.m_Scene));
        }

        // This line adds the component to the entity and returns the component object
        return this.GetComponentArray<T>(typeName).AddComponent(entity, componentClass);
    }

    // This is a function that gets a component of a certain type from an entity
    GetComponent<T extends Component>(entity: Entity, componentClass: { new(...args: any[]): T ;}, index: number) : T | null
    {
        // This line gets the type name of the component class
        let typeName = componentClass.name;

        // This block checks if there is a component array for the type, and if not, returns null
        if (!this.m_ComponentArrays.has(typeName))
        {
            return null;
        }

        // This line gets the component from the entity based on the index and returns it
        return this.GetComponentArray<T>(typeName).GetComponent(entity, index);
    }

    // This is a function that removes a component of a certain type from an entity
    RemoveComponent<T extends Component>(entity: Entity, componentClass: { new(...args: any[]): T ;}, index: number)
    {
        // This line gets the type name of the component class
        let typeName = componentClass.name;

        // This block checks if there is a component array for the type, and if not, returns
        if (!this.m_ComponentArrays.has(typeName))
        {
            return;
        }

        // This line removes the component from the entity based on the index
        this.GetComponentArray<T>(typeName).RemoveComponent(entity, index);
    }

    // This is a function that removes all components from an entity
    RemoveEntity(entity: Entity)
    {
        // This block iterates through all component arrays and removes the entity from each of them
        for (const [key, value] of this.m_ComponentArrays)
        {
            value.RemoveEntity(entity);
        }
    }
}