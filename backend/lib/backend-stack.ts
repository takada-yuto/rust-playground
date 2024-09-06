import * as cdk from 'aws-cdk-lib';
import { Code, Function, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bootstrapLocation = `./target/cdk/release`;

    // const entryId = "main";
    // const entryFnName = `${id}-${entryId}`;
    const entry = new Function(this, "RustFunction", {
      description: "Rust + Lambda + CDK",
      runtime: Runtime.PROVIDED_AL2,
      handler: `${id}`, 
      code: Code.fromAsset(bootstrapLocation),
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      tracing: Tracing.ACTIVE,
    });

    // entry.addEnvironment("AWS_NODEJS_CONNECTION_REUSE_ENABLED", "1");

    // core.Aspects.of(entry).add(new cdk.Tag("service-type", "API"));
    // core.Aspects.of(entry).add(new cdk.Tag("billing", `lambda-${entryFnName}`));
  }
}
