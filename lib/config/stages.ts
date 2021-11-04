interface DeploymentStage {
  readonly stageName: string;
  readonly isProd: boolean;
  readonly region: string;
  readonly serviceName: string;
  readonly accountId: string;
}

export const stages: DeploymentStage[] = [
  {
    stageName: "beta",
    isProd: false,
    region: "us-east-1",
    serviceName: "cdk-demo",
    accountId: "262693759774",
  },
  {
    stageName: "gamma",
    isProd: false,
    region: "us-east-1",
    serviceName: "cdk-demo",
    accountId: "786125163224",
  },
];