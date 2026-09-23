terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "db_password" {
  type      = string
  sensitive = true
}

resource "aws_db_subnet_group" "relayops" {
  name       = "relayops-db-subnets"
  subnet_ids = data.aws_subnets.default.ids
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_security_group" "relayops_db" {
  name        = "relayops-postgres"
  description = "PostgreSQL for RelayOps"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

variable "allowed_cidr" {
  type    = list(string)
  default = ["0.0.0.0/0"]
}

resource "aws_db_instance" "relayops" {
  identifier              = "relayops-postgres"
  engine                  = "postgres"
  engine_version          = "16.4"
  instance_class          = "db.t4g.micro"
  allocated_storage       = 20
  db_name                 = "relayops"
  username                = "relayops_admin"
  password                = var.db_password
  db_subnet_group_name    = aws_db_subnet_group.relayops.name
  vpc_security_group_ids  = [aws_security_group.relayops_db.id]
  publicly_accessible     = true
  skip_final_snapshot     = true
  backup_retention_period = 1
}

output "database_url" {
  value     = "postgresql://relayops_admin:${var.db_password}@${aws_db_instance.relayops.address}:5432/relayops?sslmode=require"
  sensitive = true
}

output "rds_endpoint" {
  value = aws_db_instance.relayops.address
}
