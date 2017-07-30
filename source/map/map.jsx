import {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {EasyMap} from 'easy-maps';
import {MapEngine} from '../map-engine';
const $map = Symbol('easy-map');
const $engine = Symbol('easy-map-engine');
export const ENGINE_STATUSES = {
    PENDING: 'pending',
    RESOLVED: '',
    INVALID: 'invalid',
    NONE: 'none'
};
export class Map extends Component {
    static childContextTypes = {
        map: PropTypes.instanceOf(EasyMap)
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
            PENDING,
            RESOLVED,
            INVALID,
            NONE
        } = ENGINE_STATUSES;
        let {[$map]: map} = this;
        if (map === null || map === undefined) {
            return NONE;
        }
        if (map instanceof Promise) {
            return PENDING;
        }
        if (map instanceof EasyMap) {
            return RESOLVED;
        }
        return INVALID;
    }
    set engine(Engine) {
        if (Engine instanceof Promise) {
            let enginePromise = Engine
                .then(Engine => {
                    if (this[$engine] === enginePromise) {
                        this.engine = Engine;
                    }
                });
            this[$engine] = enginePromise;
            return;
        }
        if (!EasyMap.isPrototypeOf(Engine)) {
            throw new Error('Engine should extend EasyMap');
        }
        this[$engine] = Engine;
        let {props, constructor: {engineOptions}} = this;
        this.map = new Engine(props, engineOptions);
    }
    set map(value) {
        if (value instanceof Promise) {
            this[$map] = value;
            value.then(map => {
                if(this[$map] === value) {
                    this.map = map;
                }
            });
            return;
        }
        if (!(value instanceof EasyMap)) {
            throw new Error('Map should be instance of EasyMap');
        }
        this[$map] = value;
        if (this.refs.map) {
            this.setState({});
        }
    }
    getChildContext() {
        let {map} = this;
        return {map};
    }
    Children = () => {
        let {map} = this;
        if (map) {
            let {children} = this.props;
            return <MapEngine>{children}</MapEngine>;
        }
        return false;
    };
    render() {
        let {className} = this.props;
        let {mapStatus, Children} = this;

        className = classNames(
            className,
            'easy-map',
            {
                [`easy-map_engine-${mapStatus}`]: mapStatus
            }
        );
        return <div ref="map" className={className}>
            <Children />
        </div>;
    }
}
