import {EasyView} from 'easy-maps';
import {Component} from 'react';
import {PropTypes} from 'prop-types';

function Numerable(props, propName) {
    let value = props[propName];
    if (value !== undefined) {
        if (Number.isNaN(Number(value))) {
            return new Error('Should be a number');
        }
    }
}

export class View extends Component {
    static propTypes = {
        zoom: Numerable,
        center: PropTypes.arrayOf(Numerable),
        rotation: Numerable,
        transition: Numerable,
        zoomTransition: Numerable,
        centerTransition: Numerable
    }
    static contextTypes = {
        view: PropTypes.instanceOf(EasyView)
    };
    viewSource = () => this.props;
    componentDidMount() {
        let {view} = this.context;
        let {viewSource} = this;
        view.mountSource(viewSource);
    }
    componentWillUnmount() {
        let {view} = this.context;
        let {viewSource} = this;
        view.unmountSource(viewSource);
    }
    render() {
        return false;
    }
}
