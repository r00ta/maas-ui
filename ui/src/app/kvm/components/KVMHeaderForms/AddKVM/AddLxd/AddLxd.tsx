import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import type { SetKvmType } from "../AddKVM";

import AuthenticationForm from "./AuthenticationForm";
import CredentialsForm from "./CredentialsForm";
import SelectProjectForm from "./SelectProjectForm";
import type { AddLxdStepValues, NewPodValues } from "./types";

import Stepper from "app/base/components/Stepper";
import type { ClearHeaderContent } from "app/base/types";
import { actions as podActions } from "app/store/pod";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  clearHeaderContent: ClearHeaderContent;
  setKvmType: SetKvmType;
};

export const AddLxdSteps = {
  AUTHENTICATION: "authentication",
  CREDENTIALS: "credentials",
  SELECT_PROJECT: "selectProject",
} as const;

export const AddLxd = ({
  clearHeaderContent,
  setKvmType,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const zones = useSelector(zoneSelectors.all);
  const [step, setStep] = useState<AddLxdStepValues>("credentials");
  const [newPodValues, setNewPodValues] = useState<NewPodValues>({
    certificate: "",
    key: "",
    name: "",
    password: "",
    pool: resourcePools.length ? `${resourcePools[0].id}` : "",
    power_address: "",
    zone: zones.length ? `${zones[0].id}` : "",
  });

  // We run the cleanup function here rather than in each form component
  // because we want the errors to be able to persist across forms. We also
  // clear projects, so the user has to "re-authenticate" every time.
  useEffect(() => {
    return () => {
      dispatch(podActions.cleanup());
      dispatch(podActions.clearProjects());
    };
  }, [dispatch]);

  return (
    <>
      <Stepper
        items={[
          { step: AddLxdSteps.CREDENTIALS, title: "Credentials" },
          { step: AddLxdSteps.AUTHENTICATION, title: "Authentication" },
          { step: AddLxdSteps.SELECT_PROJECT, title: "Project selection" },
        ]}
        currentStep={step}
      />
      <hr />
      {step === AddLxdSteps.CREDENTIALS && (
        <CredentialsForm
          clearHeaderContent={clearHeaderContent}
          newPodValues={newPodValues}
          setKvmType={setKvmType}
          setNewPodValues={setNewPodValues}
          setStep={setStep}
        />
      )}
      {step === AddLxdSteps.AUTHENTICATION && (
        <AuthenticationForm
          clearHeaderContent={clearHeaderContent}
          newPodValues={newPodValues}
          setNewPodValues={setNewPodValues}
          setStep={setStep}
        />
      )}
      {step === AddLxdSteps.SELECT_PROJECT && (
        <SelectProjectForm
          clearHeaderContent={clearHeaderContent}
          newPodValues={newPodValues}
          setStep={setStep}
        />
      )}
    </>
  );
};

export default AddLxd;
