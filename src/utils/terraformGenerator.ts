/**
 * Terraform Infrastructure as Code (IaC) Generator
 * 
 * An HCL (HashiCorp Configuration Language) synthesizer that takes the active 
 * nodes and edges from the ReactFlow canvas state and outputs valid, deployable
 * Terraform configuration blocks.
 */
import type { ArchitectNode, ArchitectEdge } from '../types';

export const generateTerraform = (nodes: ArchitectNode[], edges: ArchitectEdge[]): string => {
  // Initialize standard AWS Provider block requirements
  let tf = `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# IAM Role standard placeholder for Lambda executions
resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

`;

  // Iterate over individual nodes and generate component resources
  nodes.forEach((node) => {
    switch (node.data.type) {
      case 'Lambda':
        tf += `resource "aws_lambda_function" "func_${node.id.replace(/-/g, '_')}" {
  function_name = "${node.data.label.replace(/\s+/g, '-')}"
  runtime       = "nodejs18.x"
  handler       = "index.handler"
  
  # Basic role definition
  role          = aws_iam_role.iam_for_lambda.arn
}

`;
        break;
      case 'EC2':
        tf += `resource "aws_instance" "ec2_${node.id.replace(/-/g, '_')}" {
  ami           = "ami-0c55b159cbfafe1f0" # Sample Amazon Linux 2 AMI
  instance_type = "${node.data.config.instanceType || 't3.micro'}"
  tags = {
    Name = "${node.data.label}"
  }
}

`;
        break;
      case 'RDS':
        tf += `resource "aws_db_instance" "db_${node.id.replace(/-/g, '_')}" {
  allocated_storage = 20
  engine            = "mysql"
  engine_version    = "8.0"
  instance_class    = "${node.data.config.instanceType || 'db.t3.micro'}"
  username          = "admin"
  password          = "password" # IMPORTANT: Use Secrets Manager in production, avoided here for MVP brevity
  skip_final_snapshot = true
}

`;
        break;
      case 'APIGateway':
        tf += `resource "aws_api_gateway_rest_api" "api_${node.id.replace(/-/g, '_')}" {
  name        = "${node.data.label}"
  description = "Managed by Architect"
}

`;
        break;
      case 'S3':
        tf += `resource "aws_s3_bucket" "bucket_${node.id.replace(/-/g, '_')}" {
  # Generate unique bucket name pattern simulation
  bucket = "${node.data.label.toLowerCase().replace(/[^a-z0-9-]/g, '')}-${Date.now().toString().slice(-6)}"
}

`;
        break;
    }
  });

  // Evaluate connection edges and translate them into routing architectures (e.g., API Gateway to Lambda integration)
  edges.forEach((edge) => {
    const source = nodes.find((n) => n.id === edge.source);
    const target = nodes.find((n) => n.id === edge.target);

    // If an API gateway targets a Lambda Node, synthesize an integration resource
    if (source && target) {
      if (source.data.type === 'APIGateway' && target.data.type === 'Lambda') {
        tf += `resource "aws_api_gateway_integration" "integration_${edge.id.replace(/-/g, '_')}" {
  rest_api_id = aws_api_gateway_rest_api.api_${source.id.replace(/-/g, '_')}.id
  resource_id = aws_api_gateway_rest_api.api_${source.id.replace(/-/g, '_')}.root_resource_id
  http_method = "ANY"
  type        = "AWS_PROXY"
  uri         = aws_lambda_function.func_${target.id.replace(/-/g, '_')}.invoke_arn
}

`;
      }
    }
  });

  return tf;
};
