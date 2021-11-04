import { Aws, Construct, Stage, StageProps } from "@aws-cdk/core";
import { DummyService } from "./dummy-service";
import { SimpleDatabase } from "./local-constructs/simple-database";

interface PipelineStageProps extends StageProps {
  stageName: string;
  region: string;
}

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: PipelineStageProps) {
    super(scope, id, props);

    const dummyServiceStack = new DummyService(
      this,
      "CdkDemo-DummyService",
      {
        stageName: `${props?.stageName}`,
        region: `${props?.region}`,
        stackName: `CdkInfraLab-DummyService-${props?.stageName}`,
      }
    );
  }
}