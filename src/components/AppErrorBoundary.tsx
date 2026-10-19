import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { StatusScreen } from "./StatusScreen";

export class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? (
      <StatusScreen title="This page couldn’t open" description="The page may have changed while it was open. Reload to try again; your saved mission identity stays on this device.">
        <button className="neuron-primary-button" onClick={() => window.location.reload()}>Reload page</button>
        <Link to="/" className="neuron-secondary-button" onClick={() => this.setState({ failed: false })}>Return home</Link>
      </StatusScreen>
    ) : this.props.children;
  }
}
