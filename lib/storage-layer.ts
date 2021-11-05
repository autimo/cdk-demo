import { Aws, Stack, StackProps } from "@aws-cdk/core";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { Stage, Construct, StageProps } from "@aws-cdk/core";
import { ManagedPolicy, Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { SimpleBucket } from "./local-constructs/simple-bucket";

interface StorageLayerProps extends StackProps {
  stageName: string;
  region: string;
  dummyLambdaExecutionRole: string;
  dummyLambda: string;
}

export class StorageLayer extends Stack {
  readonly storageLambdaExecutionRole: Role;
  readonly storageLambda: Function;

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

    this.storageLambdaExecutionRole = new Role(
      this,
      `CdkDemo-StorageLambda-ExecutionRole-${props.stageName}`,
      {
        roleName: `CdkDemo-StorageLambda-ExecutionRole-${props.stageName}`,
        assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
        managedPolicies: [
          ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AWSLambdaBasicExecutionRole"
          ),
        ],
      }
    );

    this.storageLambda = new Function(
      this,
      `CdkDemo-StorageLambda-${props.stageName}`,
      {
        runtime: Runtime.NODEJS_14_X,
        handler: "index.handler",
        functionName: `CdkDemo-StorageLambda-${props.stageName}`,
        role: this.storageLambdaExecutionRole,
        environment: {
          "DUMMY_LAMBDA_ROLE_ARN": props.dummyLambdaExecutionRole,
          "DUMMY_LAMBDA_NAME": props.dummyLambda
        },
        code: Code.fromInline(
          `exports.handler = async function (event, context) {
          return {
            statusCode: 200,
            headers: {},
            body: {
              airportCode: "YVR",
              city: "Vancouver",
              province: "British Columbia",
              country: "Canada",
            },
          };
        };`
        ),
      }
    );
  }
}