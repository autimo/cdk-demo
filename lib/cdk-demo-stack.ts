// import * as cdk from '@aws-cdk/core';
import { Aws, Construct, Stack, StackProps, Stage } from "@aws-cdk/core";
import {
  CodePipeline,
  CodePipelineSource,
  ManualApprovalStep,
  ShellStep,
} from "@aws-cdk/pipelines";
import { stages } from "./config/stages";
import { PipelineStage } from "./pipeline-stage";

export class CdkDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'CdkDemo',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('unoah/cdk-demo', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      }),
      crossAccountKeys: true,
    });

    stages.forEach((stage) => {
      const deploymentStage = new PipelineStage(this, `${stage.stageName}`, {
        env: {
          account: stage.accountId,
          region: stage.region,
        },
        stageName: stage.stageName,
        region: stage.region,
      });

      pipeline.addStage(deploymentStage, {
        pre: [ new ManualApprovalStep(`${stage.stageName} check`)],
      })
    });
  }
}
