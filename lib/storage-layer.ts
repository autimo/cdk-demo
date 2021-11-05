import { Aws, Stack, StackProps } from "@aws-cdk/core";
import { Stage, Construct, StageProps } from "@aws-cdk/core";
import { SimpleBucket } from "./local-constructs/simple-bucket";

interface StorageLayerProps extends StackProps {
  stageName: string;
  region: string;
}

export class StorageLayer extends Stack {
  constructor(scope: Construct, id: string, props: StorageLayerProps) {
    super(scope, id);

    const earlyDayRandomBucket = new SimpleBucket(
      this,
      `earlyDayRandomBucket-${props.region}-${props.stageName}-s3-bucket`,
      {
        bucketNamePrefix: "CdkDemo-earlyDayRandomBucket",
        stageName: `${props.stageName}`,
        region: `${props.region}`
      },
    );

    const lateDayRandomBucket = new SimpleBucket(
      this,
      `lateDayRandomBucket-${props.region}-${props.stageName}-s3-bucket`,
      {
        bucketNamePrefix: "CdkDemo-lateDayRandomBucket",
        stageName: `${props.stageName}`,
        region: `${props.region}`
      },
    );

  }
}