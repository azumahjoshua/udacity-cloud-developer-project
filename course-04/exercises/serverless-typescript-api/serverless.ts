import type { AWS } from '@serverless/typescript';

// import hello from '@functions/hello';
import { createTodo, getTodo, getAllTodos, updateTodo, deleteTodo } from '@functions/todo/index';
const serverlessConfiguration: AWS = {
  service: 'serverless-typescript-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild','serverless-offline','serverless-dynamodb-local'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    }, iam: {
      role: {
        statements: [{
          Effect: 'Allow',
          Action: [
            "dynamodb:DescribeTable",
            "dynamodb:Query",
            "dynamodb:Scan",
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
          ],
          Resource: "arn:aws:dynamodb:us-west-2:*:table/TodosTable",

        }]
      }
    }
  },
  // import the function via paths
  functions: { getAllTodos, createTodo, getTodo, updateTodo, deleteTodo  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynmodb: {
      start: {
        port: 5000,
        inMemory: true,
        migrate: true,
      },
      stage : 'dev'
    }
  },
  resources: {
    Resources: {
      TodosTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "TodosTable",
          AttributeDefinitions: [{
            AttributeName: "todosId",
            AttributeType: "S",
          }],KeySchema: [{
            AttributeName: "todosId",
            KeyType: "HASH"
          }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
