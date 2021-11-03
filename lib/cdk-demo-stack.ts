import * as cdk from '@aws-cdk/core';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "@aws-cdk/pipelines";

export class CdkDemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'CdkDemo',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('unoah/cdk-demo', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });
  }
}
