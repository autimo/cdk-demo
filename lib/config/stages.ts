interface DeploymentStage {
  readonly stageName: string;
  readonly isProd: boolean;
  readonly region: string;
  readonly serviceName: string;
}

export const stages: DeploymentStage[] = [
  {
    stageName: "beta",
    isProd: false,
    region: "us-east-1",
    serviceName: "cdk-demo",
  },
  {
    stageName: "gamma",
    isProd: false,
    region: "us-east-1",
    serviceName: "cdk-demo",
  },
];