import {EasyMap} from 'easy-maps';
import {Map} from './map';

export function MapFactory(Engine, options) {
    if(!(EasyMap.isPrototypeOf(Engine) || Engine instanceof Promise)) {
        throw new Error('Should init component with EasyMap or Promise');
    }
    class ImplementedMap extends Map {
        static engineOptions = options;
        static engine = Engine;
    }
    ImplementedMap.then = function () {
        Promise.resolve(Engine).then(...arguments);
    };
    return ImplementedMap;
}
