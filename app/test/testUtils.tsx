import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material";
import type { InitialEntry, MemoryHistory } from "history";
import { createMemoryHistory } from "history";
import { Suspense } from "react";
import { Route, Router, Routes } from "react-router-dom";
import type { Cache, SWRConfiguration } from "swr";
import { SWRConfig } from "swr";

// @ts-ignore
export const cache = new Map();

const ThemeModeProvider = ({ children }: any) => {
  return <ThemeProvider theme={{}}>{children}</ThemeProvider>;
};

export interface ProviderOptions extends RenderOptions {
  initialEntries?: Array<InitialEntry>;
  route?: string;
  swrConfig?: SWRConfiguration;
}

interface ProvidersProps extends ProviderOptions {
  children: React.ReactNode;
  history: MemoryHistory;
  swrCache: Cache<any>;
}

const Providers = ({ children, history, route, swrCache }: ProvidersProps) => {
  let Wrapper = (
    <Suspense fallback={null}>
      <SWRConfig
        value={{
          dedupingInterval: 0,
          errorRetryCount: 0,
          fetcher: undefined,
          revalidateOnFocus: false,
          provider: () => swrCache,
        }}
      >
        <ThemeModeProvider></ThemeModeProvider>
      </SWRConfig>
    </Suspense>
  );

  if (route) {
    Wrapper = (
      <Router location={history!.location} navigator={history!}>
        <Routes>
          <Route element={Wrapper} path={route} />
        </Routes>
      </Router>
    );
  }

  return Wrapper;
};

const renderWithProviders = (
  ui: React.ReactElement,
  options: ProviderOptions = {}
) => {
  const { initialEntries = [], route, ...rest } = options;
  const history = createMemoryHistory({ initialEntries });
  const swrCache = new Map(cache);

  const rtl = render(ui, {
    wrapper: ({ children }) => (
      <Providers history={history} route={route} swrCache={swrCache}>
        {children}
      </Providers>
    ),
    ...rest,
  });

  return {
    ...rtl,
    rerender: (ui: React.ReactElement, rerenderOptions?: ProviderOptions) =>
      renderWithProviders(ui, {
        container: rtl.container,
        ...options,
        ...rerenderOptions,
      }),
    history,
    swrCache,
  };
};

export { screen } from "@testing-library/react";

export { renderWithProviders as render, userEvent as user };
