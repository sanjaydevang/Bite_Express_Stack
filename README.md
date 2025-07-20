How a simple frontend concept was transformed into a full-stack, automated application deployed on AWS.
Every developer has a folder of old university or personal projects. They’re great learning experiences, but often they’re just concepts—a frontend with mock data, a backend that only runs locally. But what does it take to elevate one of these projects to a production-grade, cloud-native application?

This is the story of Bite Express, a project that started as a frontend-only solution for a university course and was transformed into a full-stack, containerized application with a complete, automated CI/CD lifecycle on AWS. It’s a practical case study in applying modern DevOps principles to a real-world problem.

The initial idea was simple: create a web platform to help restaurants manage their own food delivery, bypassing the high fees of third-party apps. The original project was a solid frontend built with HTML, CSS, and vanilla JavaScript, using LocalStorage to simulate a backend. To make it real, it needed a real backend, real infrastructure, and real automation.

Phase 1: From Mockup to Full-Stack Application
The first step was to build an engine for the application. The simulated backend needed to be replaced with a robust API.

Technology Choice:

Backend: Node.js with the Express.js framework. This kept the language consistent (JavaScript) across the stack and is perfect for building fast, lightweight APIs.

Database: PostgreSQL. A powerful, open-source relational database ideal for handling structured data like restaurant menus and user orders.

We created a set of API endpoints to handle the core logic: fetching restaurants, retrieving menus, and eventually, placing orders.

// A simple API endpoint in our Express server
app.get('/api/restaurants', async (req, res) => {
  try {
    // Fetches all restaurants from the PostgreSQL database
    const { rows } = await pool.query('SELECT * FROM restaurants');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

With the backend API running, we refactored the frontend JavaScript to replace all LocalStorage calls with fetch requests to our new backend. The application was now a true full-stack project.

Phase 2: Containerizing with Docker — Consistency is Key
The classic developer problem is, "It works on my machine." To solve this and prepare for the cloud, the next logical step was containerization.

Docker allows us to package our frontend and backend into lightweight, portable containers. This ensures that the application runs the same way everywhere, from a local laptop to a production server on AWS.

We created two Dockerfiles:

Backend Dockerfile: Packaged the Node.js application.

Frontend Dockerfile: Used a lightweight NGINX web server to serve the static HTML, CSS, and JS files.

To manage running these containers together locally, we used docker-compose.yml. This file acts as an orchestrator, defining our entire application stack—frontend, backend, and even a PostgreSQL database for development—and allowing us to run it all with a single command.

# A simplified docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
  frontend:
    build: ./frontend
    ports:
      - "8080:80"
  db:
    image: postgres:14-alpine

With the command docker-compose up, our entire full-stack application was running in an isolated, consistent environment.

Phase 3: Building the Cloud Foundation with Terraform
With a containerized application ready, it was time to build its future home in the cloud. Instead of manually clicking through the AWS console, we defined our entire infrastructure as code using Terraform.

Infrastructure as Code (IaC) is a core DevOps practice. It allows us to have a version-controlled, repeatable, and automated setup for our cloud environment.

Our Terraform code built a production-grade architecture on AWS, including:

A secure VPC (Virtual Private Cloud) with public and private subnets.

Amazon RDS for PostgreSQL for a managed, highly available database.

Amazon ECS (Elastic Container Service) with Fargate to run our containers without needing to manage servers.

An Application Load Balancer (ALB) to securely manage and route incoming traffic.

Amazon ECR (Elastic Container Registry) to store our Docker images.

# A Terraform snippet for our ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "bite-express-cluster"
}

# A snippet for our production database
resource "aws_db_instance" "main" {
  identifier       = "bite-express-db"
  engine           = "postgres"
  instance_class   = "db.t3.micro"
  # ... and other configurations
}

Running terraform apply provisioned this entire environment in minutes.

Phase 4: The Automation Engine — CI/CD with GitHub Actions
This is where everything comes together. A manual deployment process is slow and prone to human error. We automated this entire workflow using a CI/CD (Continuous Integration/Continuous Deployment) pipeline with GitHub Actions.

We created a workflow file (.github/workflows/deploy.yml) that triggers automatically every time we push code to the main branch.

The pipeline performs the following steps:

Build & Push: It builds new Docker images for the frontend and backend. It then tags these images with the unique Git commit hash and pushes them to our private Amazon ECR repositories.

Deploy: Once the images are stored, the pipeline updates our ECS services in the cloud, telling them to use the new image versions. ECS handles the rest, performing a rolling update to deploy the new application version with zero downtime.

# A simplified step from our GitHub Actions workflow
- name: Build and push frontend image
  env:
    ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    IMAGE_TAG: ${{ github.sha }}
  run: |
    docker build -t $ECR_REGISTRY/bite-express-frontend:$IMAGE_TAG ./frontend
    docker push $ECR_REGISTRY/bite-express-frontend:$IMAGE_TAG

Now, a simple git push is all it takes to deploy a new feature or bug fix to production.

Conclusion: A Project Ready for the Real World
The journey of Bite Express from a simple frontend concept to a fully automated, cloud-deployed application demonstrates a complete DevOps lifecycle. It covers every key area of modern cloud engineering:

Full-Stack Development: Building both frontend and backend logic.

Containerization: Using Docker for consistency and portability.

Infrastructure as Code: Automating cloud setup with Terraform.

CI/CD: Creating a hands-off deployment pipeline with GitHub Actions.

Cloud Architecture: Designing a secure and scalable environment on AWS.

This project is more than just code; it's a blueprint for building and managing modern software.

