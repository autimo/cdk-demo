import { Aws, Stack, StackProps } from "@aws-cdk/core";
import { Stage, Construct, StageProps } from "@aws-cdk/core";
import { SimpleBucket } from "./local-constructs/simple-bucket";

interface S3BucketsStackProps extends StackProps {
  bucketNamePrefix: string;
  stageName: string;
  region: string;
}

export class S3BucketsStack extends Stack {
  constructor(scope: Construct, id: string, props: S3BucketsStackProps) {
    super(scope, id);

    const randomBucket = new SimpleBucket(
      this,
      `${props.bucketNamePrefix}-${props.region}-${props.stageName}-s3-bucket`,
      {
        bucketNamePrefix: "CdkDemo-RandomBucket",
        stageName: `${props.stageName}`,
        region: `${props.region}`
      },
    );
  }
}