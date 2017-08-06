import {Component} from 'react';
import {PropTypes} from 'prop-types';
import classNames from 'classnames';
import {EasyMap} from 'easy-maps';

export class MapTarget extends Component {
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
        let {children} = this.props;
        let className = classNames(
            'easy-map__target'
        );
        return <div ref="target" className={className}>
            {children}
        </div>;
    }
}
