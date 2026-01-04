/* eslint-disable @typescript-eslint/no-explicit-any */
import ComplianceStatus from "../ComplianceStatus";

type Props = {
  supplier: any;
  progress: any;
};

export default function ComplianceTab({ supplier, progress }: Props) {
  return <ComplianceStatus supplier={supplier} progress={progress} />;
}