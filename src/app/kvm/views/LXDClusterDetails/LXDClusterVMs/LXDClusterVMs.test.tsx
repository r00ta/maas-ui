import * as reduxToolkit from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";

import LXDClusterVMs from "./LXDClusterVMs";

import urls from "@/app/base/urls";
import { actions as machineActions } from "@/app/store/machine";
import * as query from "@/app/store/machine/utils/query";
import type { RootState } from "@/app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  virtualMachine as clusterVMFactory,
  vmCluster as vmClusterFactory,
  vmClusterState as vmClusterStateFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
  vmHost as vmHostFactory,
} from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

const callId = "mocked-nanoid";
vi.mock("@reduxjs/toolkit", async () => {
  const actual: object = await vi.importActual("@reduxjs/toolkit");
  return {
    ...actual,
    nanoid: vi.fn(),
  };
});
const mockStore = configureStore<RootState, {}>();

describe("LXDClusterVMs", () => {
  beforeEach(() => {
    vi.spyOn(query, "generateCallId").mockReturnValue(callId);
    vi.spyOn(reduxToolkit, "nanoid").mockReturnValue(callId);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a link to a cluster's host's VM page", () => {
    const machine = machineFactory({
      pod: { id: 11, name: "podrick" },
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        lists: {
          [callId]: machineStateListFactory({
            loaded: true,
            groups: [
              machineStateListGroupFactory({
                items: [machine.system_id],
              }),
            ],
          }),
        },
      }),
      vmcluster: vmClusterStateFactory({
        items: [
          vmClusterFactory({
            id: 1,
            virtual_machines: [clusterVMFactory({ system_id: "abc123" })],
          }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <LXDClusterVMs
        clusterId={1}
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { route: urls.kvm.lxd.cluster.vms.index({ clusterId: 1 }), store }
    );
    expect(screen.getByTestId("host-link")).toHaveAttribute(
      "href",
      urls.kvm.lxd.cluster.vms.host({ clusterId: 1, hostId: 11 })
    );
  });

  it("fetches VMs for the hosts", () => {
    const state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [
          vmClusterFactory({
            id: 1,
            hosts: [
              vmHostFactory({ name: "host 1" }),
              vmHostFactory({ name: "host 2" }),
            ],
          }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <LXDClusterVMs
        clusterId={1}
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { route: urls.kvm.lxd.cluster.vms.index({ clusterId: 1 }), store }
    );
    const expected = machineActions.fetch(callId, {
      filter: { pod: ["host 1", "host 2"] },
    });
    const fetches = store
      .getActions()
      .filter((action) => action.type === expected.type);
    expect(fetches[fetches.length - 1].payload.params.filter).toStrictEqual({
      pod: ["host 1", "host 2"],
    });
  });
});
