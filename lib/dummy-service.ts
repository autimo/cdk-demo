import { Aws, Construct, Stack, StackProps } from "@aws-cdk/core";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { ManagedPolicy, Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { SimpleDatabase } from "./local-constructs/simple-database";
import { SimpleBucket } from "./local-constructs/simple-bucket";

interface DummyServiceProps extends StackProps {
  stageName: string;
  region: string;
}

export class DummyService extends Stack {
  constructor(scope: Construct, id: string, props: DummyServiceProps) {
    super(scope, id);

    const dummyLambdaExecutionRole = new Role(
      this,
      `CdkDemo-DummyLambda-ExecutionRole-${props.stageName}`,
      {
        roleName: `CdkDemo-DummyLambda-ExecutionRole-${props.stageName}`,
        assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
        managedPolicies: [
          ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AWSLambdaBasicExecutionRole"
          ),
        ],
      }
    );

    const dummySimpleDatabase = new SimpleDatabase(
      this,
      `CdkDemo-DummySimpleDatabase`,
      {
        tableNamePrefix: `CdkInfraLab-DummySimpleDatabase`,
        tableRegion: `${props.region}`,
        stageName: `${props.stageName}`,
        partitionKey: "airport-code",
        readCapacity: 5,
        writeCapacity: 5,
      }
    );

    const dummySimpleBucket = new SimpleBucket(
      this,
      `CdkDemo-DummySimpleBucket`,
      {
        bucketNamePrefix: `CdkDemo-DummySimpleBucket`,
        stageName: `${props.stageName}`,
        region: `${props.region}`
      }
    )

    const dummyLambda = new Function(
      this,
      `CdkDemo-DummyLambda-${props.stageName}`,
      {
        runtime: Runtime.NODEJS_14_X,
        handler: "index.handler",
        functionName: `CdkDemo-DummyLambda-${props.stageName}`,
        role: dummyLambdaExecutionRole,
        environment: {
          "DUMMY_BUCKET_ARN": dummySimpleBucket.simpleBucket.bucketName
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