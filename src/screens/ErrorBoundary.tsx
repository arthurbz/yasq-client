import { Component } from "react"

class ErrorBoundary extends Component {
    state = {
        errorMessage: "",
    }

    componentDidCatch(error: any, info: any) {
        console.log(error.toString(), info.componentStack)
    }

    render() {
        return (
            <div>
                {"Looks like something went wrong, we're sorry."}
                {this.state.errorMessage}
            </div>
        )
    }
}

export default ErrorBoundary
