import * as reduxToolkit from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";

import VmResources, { Label } from "./VmResources";

import { Label as MachineListLabel } from "@/app/machines/views/MachineList/MachineListTable/MachineListTable";
import { actions as machineActions } from "@/app/store/machine";
import * as query from "@/app/store/machine/utils/query";
import { PodType } from "@/app/store/pod/constants";
import type { RootState } from "@/app/store/root/types";
import {
  rootState as rootStateFactory,
  machineState as machineStateFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
  machine as machineFactory,
  pod as podFactory,
  podState as podStateFactory,
} from "@/testing/factories";
import {
  userEvent,
  screen,
  renderWithBrowserRouter,
  renderWithMockStore,
} from "@/testing/utils";

vi.mock("@reduxjs/toolkit", async () => {
  const actual: object = await vi.importActual("@reduxjs/toolkit");
  return {
    ...actual,
    nanoid: vi.fn(),
  };
});
const callId = "mocked-nanoid";
const mockStore = configureStore<RootState, {}>();

describe("VmResources", () => {
  let state: RootState;

  beforeEach(() => {
    vi.spyOn(query, "generateCallId").mockReturnValue(callId);
    vi.spyOn(reduxToolkit, "nanoid").mockReturnValue(callId);
    const machines = [machineFactory(), machineFactory()];
    state = rootStateFactory({
      machine: machineStateFactory({
        items: machines,
        lists: {
          [callId]: machineStateListFactory({
            count: machines.length,
            loaded: true,
            groups: [
              machineStateListGroupFactory({
                items: machines.map(({ system_id }) => system_id),
                name: "Deployed",
              }),
            ],
          }),
        },
      }),
      pod: podStateFactory({
        items: [podFactory({ id: 1, name: "pod1", type: PodType.LXD })],
      }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("disables the dropdown if no VMs are provided", () => {
    state.machine.lists[callId].count = 0;
    state.machine.lists[callId].groups = [
      machineStateListGroupFactory({
        items: [],
        name: "Deployed",
      }),
    ];
    renderWithMockStore(<VmResources podId={1} />, { state });
    expect(
      screen.getByRole("button", { name: Label.ResourceVMs })
    ).toBeDisabled();
  });

  it("can pass additional filters to the request", () => {
    const store = mockStore(state);
    renderWithMockStore(
      <VmResources filters={{ id: ["abc123"] }} podId={1} />,
      { store }
    );
    const expected = machineActions.fetch(callId);
    const result = store
      .getActions()
      .find((action) => action.type === expected.type);
    expect(result.payload.params.filter).toStrictEqual({
      id: ["abc123"],
      pod: ["pod1"],
    });
  });

  it("can display a list of VMs", async () => {
    renderWithBrowserRouter(<VmResources podId={1} />, {
      state,
    });
    await userEvent.click(
      screen.getByRole("button", { name: Label.ResourceVMs })
    );
    expect(
      screen.getByRole("grid", {
        name: new RegExp(MachineListLabel.Machines, "i"),
      })
    ).toBeInTheDocument();
  });
});
