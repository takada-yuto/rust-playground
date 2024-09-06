import * as cdk from 'aws-cdk-lib';
import { CloudFrontWebDistribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { AnyPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Code, Function, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const rustPlaygroundBucket = new Bucket(
      this,
      "RustPlaygroundBucket",
      {
        websiteIndexDocument: "index.html",
        publicReadAccess: true,
        autoDeleteObjects: true,
        blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    )

    // S3バケットへのアクセスを許可するIAMポリシーステートメントを作成
    const policyStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:GetObject"],
      principals: [new AnyPrincipal()],
      resources: [rustPlaygroundBucket.arnForObjects("*")],
    })
    rustPlaygroundBucket.addToResourcePolicy(policyStatement)

    // CloudFrontからS3バケットへのアクセスを許可するためのOAIを作成
    const rustPlaygroundOAI = new OriginAccessIdentity(
      this,
      "RustPlaygroundOAI"
    )
    rustPlaygroundBucket.grantRead(rustPlaygroundOAI)


    const distribution = new CloudFrontWebDistribution(
      this,
      "RustPlaygroundWebDestribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: rustPlaygroundBucket,
              originAccessIdentity: rustPlaygroundOAI,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
      }
    )



    const lambda = new Function(this, "RustFunction", {
      runtime: Runtime.PROVIDED_AL2,
      handler: `${id}`, 
      code: Code.fromAsset("./target/cdk/release"),
      timeout: cdk.Duration.seconds(10),
      logRetention: cdk.aws_logs.RetentionDays.ONE_WEEK,
      tracing: Tracing.ACTIVE,
    });

    const lambdaFunctionURL =
      lambda.addFunctionUrl({
        authType: cdk.aws_lambda.FunctionUrlAuthType.NONE,
      })


    new BucketDeployment(this, "RustPlaygroundBucketDeployment", {
      sources: [
        Source.asset("../frontend/out"),
        Source.jsonData("env.json", { lambdaFunctionURL: lambdaFunctionURL.url }),
      ],
      destinationBucket: rustPlaygroundBucket,
      distribution: distribution,
      distributionPaths: ["/*"],
    })

  }
}
