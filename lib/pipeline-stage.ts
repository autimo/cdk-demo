import { Aws, Construct, Stage, StageProps } from "@aws-cdk/core";
import { DummyService } from "./dummy-service";
import { SimpleDatabase } from "./local-constructs/simple-database";
import { StorageLayer } from "./storage-layer";

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
        stackName: `CdkDemo-DummyService-${props?.stageName}`,
      }
    );

    const storageLayer = new StorageLayer(
      this,
      "CdkDemo-StorageLayer",
      {
        stageName: `${props?.stageName}`,
        region: `${props?.region}`,
      }
    )
  }
}