import { useSelector } from "react-redux";

import DHCPTable from "@/app/base/components/DHCPTable";
import { useFetchActions } from "@/app/base/hooks";
import { actions as ipRangeActions } from "@/app/store/iprange";
import ipRangeSelectors from "@/app/store/iprange/selectors";
import type { RootState } from "@/app/store/root/types";
import { actions as subnetActions } from "@/app/store/subnet";
import subnetSelectors from "@/app/store/subnet/selectors";
import type { Subnet, SubnetMeta } from "@/app/store/subnet/types";

type Props = {
  modelName: string;
  subnetIds: Subnet[SubnetMeta.PK][];
};

const DHCPSnippets = ({ modelName, subnetIds }: Props): JSX.Element => {
  const subnets = useSelector((state: RootState) =>
    subnetSelectors.getByIds(state, subnetIds)
  );
  const ipranges = useSelector(ipRangeSelectors.all);

  useFetchActions([subnetActions.fetch, ipRangeActions.fetch]);

  return (
    <DHCPTable ipRanges={ipranges} modelName={modelName} subnets={subnets} />
  );
};

export default DHCPSnippets;
