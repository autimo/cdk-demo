import { Aws, Construct, Stage, StageProps } from "@aws-cdk/core";
import { DummyService } from "./dummy-service";

interface PipelineStageProps extends StageProps {
  stageName: string;
  region: string;
}

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: PipelineStageProps) {
    super(scope, id, props);

    const dummyServiceStack = new DummyService(
      this,
      "CdkInfraLab-DummyService",
      {
        stageName: `${props?.stageName}`,
        region: `${props?.region}`,
        stackName: `CdkInfraLab-DummyService-${props?.stageName}`,
      }
    );
  }
}