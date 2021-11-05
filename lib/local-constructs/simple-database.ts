import { Aws, Construct } from "@aws-cdk/core";
import {
  ManagedPolicy,
  Role, 
  ServicePrincipal, 
  PolicyDocument, 
  PolicyStatement} from '@aws-cdk/aws-iam';
import { Table, AttributeType, BillingMode } from "@aws-cdk/aws-dynamodb";

interface SimpleDatabaseProps {
  tableNamePrefix: string;
  tableRegion: string;
  stageName: string;
  partitionKey: string;
  readCapacity: number;
  writeCapacity: number;
}

export class SimpleDatabase extends Construct {
  readonly simpleDatabaseTable: Table;
  readonly veryRandomRole: Role;

  constructor(scope: Construct, id: string, props: SimpleDatabaseProps) {
    super(scope, id);

    const veryRandomPolicy = new PolicyDocument({
      statements: [
        new PolicyStatement({
          resources: ["*"],
          actions: [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
        ],
        }),
      ],
    });

    this.veryRandomRole = new Role(this, 'totally-random-role', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      description: 'A totally ramdom role for demonstration',
      inlinePolicies: {
        VeryRandomPolicy: veryRandomPolicy,
      },
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
    })

    this.simpleDatabaseTable = new Table(
      this,
      `${props.tableNamePrefix}-${props.stageName}-dynamodb`,
      {
        tableName: `${props.tableNamePrefix}-${props.stageName}`,
        partitionKey: {
          name: `${props.partitionKey}`,
          type: AttributeType.STRING,
        },
        billingMode: BillingMode.PROVISIONED,
        readCapacity: props.readCapacity,
        writeCapacity: props.writeCapacity,
      }
    );
  }
}