import { Type } from 'serializer.ts/Decorators';


export class TypeList {
    name: string;
    @Type(() => Pair)
    typeCodes: Pair[];
}

export class PairItem {
    value: string;
    label: string;
}

export class Pair {
    label: string;
    routing: string;
}
