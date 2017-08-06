import {verifyEngine} from 'easy-maps';
import {MapPrototype} from './map';

export function MapFactory(engine, options) {
    if(!(engine instanceof Promise)) {
        verifyEngine(engine);
    }
    class Map extends MapPrototype {
        static engineOptions = options;
        static engine = engine;
    }
    Map.then = function () {
        Promise.resolve(engine).then(...arguments);
    };
    return Map;
}
