import { Component, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { StatusScreen } from "./StatusScreen";

class RouteErrorBoundary extends Component<{ children: ReactNode; routeKey: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { console.error("The page could not render.", error); }
  componentDidUpdate(previous: Readonly<{ children: ReactNode; routeKey: string }>) {
    if (this.state.failed && previous.routeKey !== this.props.routeKey) this.setState({ failed: false });
  }
  render() {
    return this.state.failed ? (
      <StatusScreen title="This page couldn’t open" description="The page may have changed while it was open. Reload to try again; your saved mission identity stays on this device.">
        <button className="neuron-primary-button" onClick={() => window.location.reload()}>Reload page</button>
        {this.props.routeKey !== "/" && <Link to="/" className="neuron-secondary-button">Return home</Link>}
      </StatusScreen>
    ) : this.props.children;
  }
}

export function AppErrorBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return <RouteErrorBoundary routeKey={pathname}>{children}</RouteErrorBoundary>;
}
