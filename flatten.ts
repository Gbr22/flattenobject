import { PrefixObject } from "./prefix";
import { UnionToIntersection } from "./util";

type ObjectValues<
    E extends object
> = E extends { [s: string]: infer T } ? T : never

export function flattenObject<
    T extends object,
>(obj: T): FlattenObject<T> {
    return undefined as any;
}

export type FlattenObject<T extends object> = (UnionToIntersection<
    ObjectValues<
        { [P in Exclude<keyof T,symbol | number>]: T[P] extends object ? PrefixObject<T[P],`${P}_`> : { [Prop in P]: T[P] } }
    >
>)

const hasObjects = Symbol("has objects");
type HasObjectsAsValue<T extends object> = 
    ({
        [P in Exclude<keyof T,symbol | number>]:
            T[P] extends object
                ? typeof hasObjects
                : never
    }) [Exclude<keyof T,symbol | number>] extends never ? false : true;

export type FlattenObjectRecursive<T extends object> =
    HasObjectsAsValue<FlattenObject<T> & object> extends true
        ? FlattenObjectRecursive<FlattenObject<T> & object>
        : FlattenObject<T>

export function flattenObjectRecursive<
    T extends object,
>(obj: T): FlattenObjectRecursive<T> {
    return undefined as any;
}