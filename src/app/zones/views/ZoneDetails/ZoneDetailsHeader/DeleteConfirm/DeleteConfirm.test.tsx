import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DeleteConfirm from "./DeleteConfirm";

import type { RootState } from "@/app/store/root/types";
import {
  zone as zoneFactory,
  zoneState as zoneStateFactory,
  rootState as rootStateFactory,
} from "@/testing/factories";
import { userEvent, screen, render } from "@/testing/utils";

const mockStore = configureStore();

describe("DeleteConfirm", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      zone: zoneStateFactory({
        items: [
          zoneFactory({
            id: 1,
            name: "zone-name",
          }),
        ],
      }),
    });
  });

  it("runs onConfirm function when Delete AZ is clicked", async () => {
    const closeExpanded = vi.fn();
    const onConfirm = vi.fn();
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <DeleteConfirm
          closeExpanded={closeExpanded}
          confirmLabel="Delete AZ"
          deleting={false}
          onConfirm={onConfirm}
        />
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: "Delete AZ" }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("runs closeExpanded function when cancel is clicked", async () => {
    const closeExpanded = vi.fn();
    const onConfirm = vi.fn();
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <DeleteConfirm
          closeExpanded={closeExpanded}
          confirmLabel="Delete AZ"
          deleting={false}
          onConfirm={onConfirm}
        />
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeExpanded).toHaveBeenCalled();
  });
});
