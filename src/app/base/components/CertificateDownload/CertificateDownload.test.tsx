import * as fileDownload from "js-file-download";

import CertificateDownload, { Labels, TestIds } from "./CertificateDownload";

import type { GeneratedCertificate } from "@/app/store/general/types";
import { generatedCertificate as certFactory } from "@/testing/factories";
import { userEvent, render, screen } from "@/testing/utils";

vi.mock("js-file-download", () => {
  return {
    default: vi.fn(),
  };
});

describe("CertificateDownload", () => {
  let certificate: GeneratedCertificate;

  beforeEach(() => {
    certificate = certFactory({
      certificate: "certificate",
      CN: "name@host",
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("can generate a download based on the certificate details", async () => {
    const downloadSpy = vi.spyOn(fileDownload, "default");
    render(
      <CertificateDownload
        certificate={certificate.certificate}
        filename={certificate.CN}
      />
    );

    await userEvent.click(
      screen.getByRole("button", { name: Labels.Download })
    );

    expect(downloadSpy).toHaveBeenCalledWith(
      certificate.certificate,
      certificate.CN
    );
  });

  it("shows as a code snippet if certificate was generated", () => {
    render(
      <CertificateDownload
        certificate={certificate.certificate}
        filename={certificate.CN}
        isGenerated
      />
    );

    expect(screen.getByTestId(TestIds.CertCodeSnippet)).toBeInTheDocument();
    expect(screen.queryByTestId(TestIds.CertTextarea)).not.toBeInTheDocument();
  });

  it("shows as a textarea if certificate was not generated", () => {
    render(
      <CertificateDownload
        certificate={certificate.certificate}
        filename={certificate.CN}
        isGenerated={false}
      />
    );

    expect(screen.getByTestId(TestIds.CertTextarea)).toBeInTheDocument();
    expect(
      screen.queryByTestId(TestIds.CertCodeSnippet)
    ).not.toBeInTheDocument();
  });
});
