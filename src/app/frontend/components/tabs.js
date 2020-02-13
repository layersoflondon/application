import React from 'react';

class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sizes: {},
        };
        this.els = {};
    }
    componentDidMount() {
        this.getSizes();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.children !== this.props.children && prevProps.active !== this.props.active) {
            this.getSizes();
        }
    }

    getSizes() {
        const rootBounds = this.root.getBoundingClientRect();

        const sizes = {};

        Object.keys(this.els).forEach((key) => {
            const el = this.els[key];
            const bounds = el.getBoundingClientRect();

            const left = bounds.left - rootBounds.left;
            const right = rootBounds.right - bounds.right;

            sizes[key] = {left, right};
        });

        this.setState({sizes});
        return sizes;
    }

    render() {

        return (
            <ul
                ref={el => this.root = el}
            >
                {React.Children.map(this.props.children, (child, i) => {
                    let className = ``;
                    if (child.key === this.props.active) {
                        className = `is-current`;
                    }
                    return (
                        <li
                            className={className}
                            onClick={() => {
                                this.props.onChange(child.key);
                            }}
                            ref={el => this.els[child.key] = el}
                        ><a href="#">
                            {child}
                        </a></li>
                    );
                })}
            </ul>
        );
    }
}

export default Tabs;