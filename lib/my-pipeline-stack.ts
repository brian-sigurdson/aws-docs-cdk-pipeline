import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { MyPipelineAppStage } from './my-pipeline-app-stage';

export class MyPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('brian-sigurdson/aws-docs-cdk-pipeline', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    const testStage = pipeline.addStage(new MyPipelineAppStage(this, 'test', {
      env: {
        account: '283632290378',
        region: 'us-east-1'
      }
    }));

    testStage.addPost(new ManualApprovalStep('approval'));

    const test2Stage = pipeline.addStage(new MyPipelineAppStage(this, 'test2', {
      env: {
        account: '283632290378',
        region: 'us-east-1'
      }
    }));
   

  }
}
