import {Component} from 'react';
import {PropTypes} from 'prop-types';
import classNames from 'classnames';
import {EasyMap, EasyView, verifyEngine} from 'easy-maps';
import {MapTarget} from '../map-target';
const $map = Symbol('easy-map');
const $engine = Symbol('easy-map-engine');
export const ENGINE_STATUSES = {
    RESOLVED: '',
    ENGINE_PENDING: 'engine-pending',
    ENGINE_INVALID: 'engine-invalid',
    MAP_PENDING: 'map-panding',
    MAP_INVALID: 'map-invalid',
    NO_ENGINE: 'no-engine',
    NO_MAP: 'no-map'
};
export class MapPrototype extends Component {
    static childContextTypes = {
        map: PropTypes.instanceOf(EasyMap),
        view: PropTypes.instanceOf(EasyView),
        engine: PropTypes.object
    }
    constructor(props, context) {
        super(props, context);
        let {constructor: {engine}} = this;
        this.engine = engine;
    }
    get map() {
        let {[$map]: map} = this;
        if (map instanceof EasyMap) {
            return map;
        }
    }
    get mapStatus() {
        const {
            RESOLVED,
            ENGINE_PENDING,
            ENGINE_INVALID,
            MAP_PENDING,
            MAP_INVALID,
            NO_ENGINE,
            NO_MAP
        } = ENGINE_STATUSES;
        let {[$map]: map, [$engine]: engine} = this;
        if (engine === null || engine === undefined) {
            return NO_ENGINE;
        }
        if (engine instanceof Promise) {
            return ENGINE_PENDING;
        }
        if (engine instanceof Error) {
            return ENGINE_INVALID;
        }
        if (map === null || map === undefined) {
            return NO_MAP;
        }
        if (map instanceof Promise) {
            return MAP_PENDING;
        }
        if (map instanceof EasyMap) {
            return RESOLVED;
        }
        return MAP_INVALID;
    }
    get engine() {
        return this[$engine];
    }
    set engine(engine) {
        engine = this.resolveEngine(engine);
        this[$engine] = engine;
        this.updateIfMounted();
        let {Map, View} = engine;
        if (Map) {
            let {props, constructor: {engineOptions}} = this;
            let map = new Map(props, engineOptions);
            this.view = new View(map);
            this.map = map;
        }
    }
    resolveEngine(engine) {
        if (engine instanceof Promise) {
            let enginePromise = engine;
            let resolveValue = value => {
                if (this.engine === enginePromise) {
                    this.engine = value;
                }
            };
            enginePromise
                .then(resolveValue, resolveValue);
            return enginePromise;
        }
        if (engine instanceof Error) {
            return engine;
        }

        try {
            verifyEngine(engine);
            return engine;
        } catch (error) {
            return error;
        }

    }
    set map(map) {
        if (map instanceof Promise) {
            this[$map] = map;
            let mapPromise = map;
            let resolveValue = value => {
                if(this[$map] === mapPromise) {
                    this.map = value;
                }
            };
            mapPromise.then(resolveValue, resolveValue);
            return;
        }
        this[$map] = map;
        this.updateIfMounted();
    }
    updateIfMounted() {
        if (this.refs.map) {
            this.setState({});
        }
    }
    updateView() {
        let {view} = this;
        if (this.refs.map && view) {
            view.updateProps();
        }
    }
    getChildContext() {
        let {engine, map, view} = this;
        return {map, engine, view};
    }
    Children = () => {
        let {map} = this;
        if (map) {
            let {children} = this.props;
            return <MapTarget>{children}</MapTarget>;
        }
        return false;
    };
    componentDidMount() {
        this.updateView();
    }
    componentDidUpdate() {
        this.updateView();
    }
    render() {
        let {className} = this.props;
        let {
            mapStatus,
            Children,
            engine: {engineName},
            view
        } = this;
        engineName = engineName && engineName.replace(/(\s+|(?=(?!\b)[A-Z]))/g, '-').toLowerCase();

        className = classNames(
            className,
            'easy-map',
            {
                [`easy-map_${mapStatus}`]: mapStatus,
                [`easy-map_${engineName}`]: engineName
            }
        );
        return <div ref="map" className={className}>
            <Children />
        </div>;
    }
}
