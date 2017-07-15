import {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {EasyMap} from 'easy-maps';

export class MapEngine extends Component {
    static contextTypes = {
        map: PropTypes.instanceOf(EasyMap)
    };
    get map() {
        return this.context.map;
    }
    componentDidMount() {
        let {map, refs} = this;
        map.mount(refs.target);
    }
    render() {
        let {map: {constructor: {engineName = ''}}} = this;
        let {children} = this.props;
        engineName = engineName.replace(/(\s+|(?=[A-Z]))/g, '-').toLowerCase();
        let className = classNames(
            'easy-map__engine', {
                [`easy-map__engine-${engineName}`]: engineName
            }
        );
        return <div ref="target" className={className}>
            {children}
        </div>;
    }
}
