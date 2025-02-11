import reducers, { actions } from "./slice";

import {
  nodeDevice as nodeDeviceFactory,
  nodeDeviceState as nodeDeviceStateFactory,
} from "@/testing/factories";

describe("node device reducer", () => {
  it("returns the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      errors: null,
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("reduces getByNodeIdStart", () => {
    const state = nodeDeviceStateFactory({
      loading: false,
    });

    expect(reducers(state, actions.getByNodeIdStart(null))).toEqual(
      nodeDeviceStateFactory({ loading: true })
    );
  });

  it("reduces getByNodeIdSuccess", () => {
    const existingNodeDevice = nodeDeviceFactory();
    const newNodeDevice = nodeDeviceFactory();
    const newNodeDevice2 = nodeDeviceFactory();

    const nodeDeviceState = nodeDeviceStateFactory({
      items: [existingNodeDevice],
      loading: true,
    });

    expect(
      reducers(
        nodeDeviceState,
        actions.getByNodeIdSuccess("abc123", [newNodeDevice, newNodeDevice2])
      )
    ).toEqual(
      nodeDeviceStateFactory({
        items: [existingNodeDevice, newNodeDevice, newNodeDevice2],
        loading: false,
        loaded: true,
      })
    );
  });

  it("reduces getByNodeIdError", () => {
    const nodeDeviceState = nodeDeviceStateFactory({ loading: true });

    expect(
      reducers(
        nodeDeviceState,
        actions.getByNodeIdError("Could not get node device")
      )
    ).toEqual(
      nodeDeviceStateFactory({
        errors: "Could not get node device",
        loading: false,
      })
    );
  });
});
