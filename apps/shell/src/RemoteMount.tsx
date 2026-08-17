import { Suspense, lazy, Component, type ReactNode, type ComponentType } from "react";
import { MemoryRouter } from "react-router-dom";
import { Center, Loader, Alert } from "@mantine/core";

class RemoteBoundary extends Component<
  { name: string; children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <Alert color="red" title={`No se pudo cargar el microfrontend "${this.props.name}"`}>
          {String(this.state.error.message)}
        </Alert>
      );
    }
    return this.props.children;
  }
}

const remotes: Record<"cliente" | "taller", ComponentType> = {
  cliente: lazy(() => import("cliente/App")),
  taller: lazy(() => import("taller/App")),
};

export function RemoteMount({
  name,
  initialPath = "/",
}: {
  name: "cliente" | "taller";
  initialPath?: string;
}) {
  const Remote = remotes[name];
  return (
    <RemoteBoundary name={name}>
      <Suspense
        fallback={
          <Center h={300}>
            <Loader />
          </Center>
        }
      >
        <MemoryRouter
          initialEntries={[initialPath]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Remote />
        </MemoryRouter>
      </Suspense>
    </RemoteBoundary>
  );
}
