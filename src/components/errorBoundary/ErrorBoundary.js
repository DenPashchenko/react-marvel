import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErroorBoundary extends Component {
    state = {
        error: false
    }

    componentDidCatch(err, errorInfo) {
        console.log(err, errorInfo);
        this.setState({ error: true });
    }

    render() {
        if (this.state.err) {
            return <ErrorMessage/>
        }

        return this.props.children;
    }
}

export default ErroorBoundary;