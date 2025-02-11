import type { DomainListSidePanelContent } from "../../views/DomainsList/constants";
import { DomainListSidePanelViews } from "../../views/DomainsList/constants";

import DomainForm from "./DomainForm";

import { Labels as AddDomainLabels } from "@/app/domains/views/DomainsList/DomainListHeaderForm/DomainListHeaderForm";
import { Labels as DomainTableLabels } from "@/app/domains/views/DomainsList/DomainsTable/DomainsTable";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

const domain = domainFactory({ name: "test" });
const state = rootStateFactory({
  domain: domainStateFactory({
    items: [domain],
  }),
});

it("can render the AddDomain form", () => {
  const sidePanelContent: DomainListSidePanelContent = {
    view: DomainListSidePanelViews.ADD_DOMAIN,
  };
  renderWithBrowserRouter(
    <DomainForm
      setSidePanelContent={vi.fn()}
      sidePanelContent={sidePanelContent}
    />,
    { state }
  );
  expect(screen.getByRole("form", { name: AddDomainLabels.FormLabel }));
});

it("can render the SetDefault form", () => {
  const sidePanelContent: DomainListSidePanelContent = {
    view: DomainListSidePanelViews.SET_DEFAULT,
    extras: {
      id: domain.id,
    },
  };
  renderWithBrowserRouter(
    <DomainForm
      setSidePanelContent={vi.fn()}
      sidePanelContent={sidePanelContent}
    />,
    { state }
  );
  expect(screen.getByRole("form", { name: DomainTableLabels.FormTitle }));
});
