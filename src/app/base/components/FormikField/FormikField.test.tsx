import { Formik } from "formik";

import FormikField from "./FormikField";

import { render, screen } from "testing/utils";

describe("FormikField", () => {
  it("can set a different component", () => {
    const Component = () => <select />;
    render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikField component={Component} name="username" />
      </Formik>
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("can pass errors", () => {
    render(
      <Formik
        initialErrors={{ username: "Uh oh!" }}
        initialTouched={{ username: true }}
        initialValues={{ username: "" }}
        onSubmit={jest.fn()}
      >
        <FormikField name="username" />
      </Formik>
    );

    expect(screen.getByRole("textbox")).toHaveErrorMessage("Error: Uh oh!");
  });

  it("can hide the errors", () => {
    render(
      <Formik
        initialErrors={{ username: "Uh oh!" }}
        initialTouched={{ username: true }}
        initialValues={{ username: "" }}
        onSubmit={jest.fn()}
      >
        <FormikField displayError={false} name="username" />
      </Formik>
    );

    expect(screen.getByRole("textbox")).not.toHaveErrorMessage();
  });
});
