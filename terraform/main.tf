# This block configures Terraform itself.
terraform {
  # This specifies the required provider and its version.
  # We are telling Terraform that we need the "aws" provider
  # and we want a version that is compatible with 5.0.
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# This block configures the AWS provider itself.
# It tells Terraform which region to create the resources in.
# Terraform will automatically use the credentials you configured
# with the AWS CLI earlier.
provider "aws" {
  region = "us-east-1" # You can change this to your preferred region
}

# This is a placeholder to verify our setup.
# It gets the AWS Account ID of the user running the command.
data "aws_caller_identity" "current" {}

# This output will display the Account ID after we run terraform apply.
output "account_id" {
  value = data.aws_caller_identity.current.account_id
}

# --- VPC (Virtual Private Cloud) ---
# This creates a dedicated virtual network for our application.
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16" # Defines the IP address range for the VPC
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "bite-express-vpc"
  }
}

# --- Subnets ---
# We create subnets to partition the network.
# Public subnets are for resources that need to be accessible from the internet (like a load balancer).
# Private subnets are for protected resources (like our application servers and database).

resource "aws_subnet" "public_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a" # Spanning multiple AZs provides high availability
  map_public_ip_on_launch = true

  tags = {
    Name = "bite-express-public-a"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "bite-express-public-b"
  }
}

resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "bite-express-private-a"
  }
}

resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "bite-express-private-b"
  }
}

# --- Internet Gateway ---
# This allows communication between the VPC and the internet.
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "bite-express-igw"
  }
}

# --- Elastic IP for NAT Gateway ---
# A NAT Gateway needs a static public IP address to function.
resource "aws_eip" "nat" {
  domain = "vpc"
}

# --- NAT Gateway ---
# This allows instances in the private subnets to initiate outbound traffic
# to the internet (e.g., for software updates), but prevents the internet
# from initiating a connection with those instances.
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_a.id # Must be placed in a public subnet

  tags = {
    Name = "bite-express-nat"
  }

  depends_on = [aws_internet_gateway.main]
}

# --- Route Tables ---
# Route tables define rules for where network traffic is directed.

# Public Route Table: directs internet-bound traffic to the Internet Gateway.
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0" # Represents all IP addresses (the internet)
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "bite-express-public-rt"
  }
}

# Associate the public route table with our public subnets.
resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

# Private Route Table: directs internet-bound traffic to the NAT Gateway.
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = {
    Name = "bite-express-private-rt"
  }
}

# Associate the private route table with our private subnets.
resource "aws_route_table_association" "private_a" {
  subnet_id      = aws_subnet.private_a.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_b" {
  subnet_id      = aws_subnet.private_b.id
  route_table_id = aws_route_table.private.id
}

# --- Security Groups ---
# These act as virtual firewalls for our resources.

# Security Group for the Application Load Balancer (ALB)
resource "aws_security_group" "alb" {
  name        = "bite-express-alb-sg"
  description = "Allow HTTP traffic to ALB"
  vpc_id      = aws_vpc.main.id

  # Allow incoming HTTP traffic from anywhere
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "bite-express-alb-sg"
  }
}

# Security Group for the ECS Fargate services (our application)
resource "aws_security_group" "ecs_tasks" {
  name        = "bite-express-ecs-tasks-sg"
  description = "Allow traffic from ALB to Fargate tasks"
  vpc_id      = aws_vpc.main.id

  # Allow incoming traffic from the ALB on the application port (frontend)
  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id] # Only allows traffic from the ALB
  }

  # Allow incoming traffic from the ALB on the application port (backend)
  ingress {
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id] # Only allows traffic from the ALB
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "bite-express-ecs-tasks-sg"
  }
}

# Security Group for the RDS PostgreSQL database
resource "aws_security_group" "rds" {
  name        = "bite-express-rds-sg"
  description = "Allow traffic from ECS tasks to RDS"
  vpc_id      = aws_vpc.main.id

  # Allow incoming traffic from our ECS tasks on the PostgreSQL port
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id] # Only allows traffic from our application
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "bite-express-rds-sg"
  }
}

# --- RDS Database ---
# This section defines our managed PostgreSQL database.

# This variable will hold the database password.
# Using a variable is more secure than hardcoding it.
variable "db_password" {
  description = "The password for the RDS database"
  type        = string
  sensitive   = true
}

# A DB subnet group tells RDS which subnets it can be placed in.
# We use our private subnets for security.
resource "aws_db_subnet_group" "main" {
  name       = "bite-express-db-subnet-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]

  tags = {
    Name = "Bite Express DB Subnet Group"
  }
}

# This is the actual RDS database instance.
resource "aws_db_instance" "main" {
  identifier           = "bite-express-db"
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "15" # UPDATED: Changed to major version to let AWS pick the latest minor version
  instance_class       = "db.t3.micro" # Qualifies for AWS Free Tier
  db_name              = "biteexpressdb"
  username             = "biteexpressuser"
  password             = var.db_password
  db_subnet_group_name = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot  = true # Set to false in a real production environment
}

# --- ECR (Elastic Container Registry) ---
# This creates a private repository to store our backend Docker image.
resource "aws_ecr_repository" "backend" {
  name = "bite-express-backend"
}

# This creates a private repository to store our frontend Docker image.
resource "aws_ecr_repository" "frontend" {
  name = "bite-express-frontend"
}

# --- ECS (Elastic Container Service) ---
# This is the cluster that will manage and run our containers.
resource "aws_ecs_cluster" "main" {
  name = "bite-express-cluster"
}

# --- Application Load Balancer (ALB) ---
resource "aws_lb" "main" {
  name               = "bite-express-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]
}

resource "aws_lb_target_group" "frontend" {
  name        = "bite-express-frontend-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
}

resource "aws_lb_target_group" "backend" {
  name        = "bite-express-backend-tg"
  port        = 3001
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
}

resource "aws_lb_listener" "frontend" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

resource "aws_lb_listener_rule" "backend" {
  listener_arn = aws_lb_listener.frontend.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

# --- IAM Roles for ECS ---
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecs_task_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# --- ECS Task Definitions and Services ---
resource "aws_ecs_task_definition" "frontend" {
  family                   = "frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "frontend"
      image     = aws_ecr_repository.frontend.repository_url
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
    }
  ])
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = aws_ecr_repository.backend.repository_url
      portMappings = [
        {
          containerPort = 3001
          hostPort      = 3001
        }
      ]
      environment = [
        {
          name  = "DB_HOST"
          value = aws_db_instance.main.address
        },
        {
          name  = "DB_PORT"
          value = tostring(aws_db_instance.main.port)
        },
        {
          name  = "DB_USER"
          value = aws_db_instance.main.username
        },
        {
          name  = "DB_PASSWORD"
          value = var.db_password
        },
        {
          name  = "DB_DATABASE"
          value = aws_db_instance.main.db_name
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "frontend" {
  name            = "frontend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "frontend"
    container_port   = 80
  }

  depends_on = [aws_lb_listener.frontend]
}

resource "aws_ecs_service" "backend" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 3001
  }

  depends_on = [aws_lb_listener_rule.backend]
}
