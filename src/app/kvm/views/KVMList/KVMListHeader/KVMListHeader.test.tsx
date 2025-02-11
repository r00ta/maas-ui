import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import KVMListHeader from "./KVMListHeader";

import urls from "@/app/base/urls";
import { KVMSidePanelViews } from "@/app/kvm/constants";
import type { RootState } from "@/app/store/root/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "@/testing/factories";

const mockStore = configureStore();

describe("KVMListHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        loaded: true,
        items: [podFactory({ id: 1 }), podFactory({ id: 2 })],
      }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("displays a loader if pods have not loaded", () => {
    state.pod.loaded = false;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <CompatRouter>
            <KVMListHeader setSidePanelContent={vi.fn()} title="some text" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays a pod count if pods have loaded", () => {
    state.pod.loaded = true;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <CompatRouter>
            <KVMListHeader setSidePanelContent={vi.fn()} title="some text" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("2 KVM hosts available")).toBeInTheDocument();
  });

  it("can open the add LXD form at the LXD URL", async () => {
    const setSidePanelContent = vi.fn();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: urls.kvm.lxd.index, key: "testKey" }]}
        >
          <CompatRouter>
            <KVMListHeader
              setSidePanelContent={setSidePanelContent}
              title="LXD"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("button", { name: "Add LXD host" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add Virsh host" })
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Add LXD host" }));
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMSidePanelViews.ADD_LXD_HOST,
    });
  });

  it("can open the add Virsh form at the Virsh URL", async () => {
    const setSidePanelContent = vi.fn();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: urls.kvm.virsh.index, key: "testKey" }]}
        >
          <CompatRouter>
            <KVMListHeader
              setSidePanelContent={setSidePanelContent}
              title="Virsh"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("button", { name: "Add Virsh host" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add LXD host" })
    ).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Add Virsh host" })
    );
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMSidePanelViews.ADD_VIRSH_HOST,
    });
  });
});
