/* eslint-disable @typescript-eslint/no-explicit-any */
import ComplianceStatus from "../ComplianceStatus";

type Props = {
  supplier: any;
  progress: any;
  permissions : any
};

export default function ComplianceTab({ supplier, progress  ,permissions }: Props) {
  return <ComplianceStatus supplier={supplier} progress={progress} permissions={permissions}/>;
}