pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = "dockerhub-creds"  // Jenkins credentials ID for Docker Hub
        FRONTEND_IMAGE = "raveeshapeiris/ecommerce-frontend"
        BACKEND_IMAGE = "raveeshapeiris/ecommerce-backend"
        AWS_CREDENTIALS_ID = "aws-creds"  // AWS credentials ID in Jenkins
        TF_DIR = "infrastructure"  // Directory where your Terraform code is located
        ANSIBLE_DIR = "ansible"  // Directory where your Ansible playbooks are located
    }

    stages {
        // Checkout Code from GitHub repository
        stage('Checkout Code') {
            steps {
                git branch: 'main', 
                    credentialsId: 'github-creds',  // Add this credential in Jenkins using your GitHub PAT
                    url: 'https://github.com/RaveeshaPeiris/Ecommerce.git'
            }
        }

        // Build Frontend Docker Image
        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $FRONTEND_IMAGE:$BUILD_NUMBER ./frontend'
            }
        }

        // Build Backend Docker Image
        stage('Build Backend Image') {
            steps {
                sh 'docker build -t $BACKEND_IMAGE:$BUILD_NUMBER ./backend'
            }
        }

        // Docker login to Docker Hub
        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKER_CREDENTIALS_ID}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        // Push Docker images (Frontend and Backend)
        stage('Push Frontend & Backend') {
            steps {
                sh 'docker push $FRONTEND_IMAGE:$BUILD_NUMBER'
                sh 'docker push $BACKEND_IMAGE:$BUILD_NUMBER'
            }
        }

        // Terraform - Initialize and Apply for Infrastructure provisioning
        stage('Terraform - Initialize and Apply') {
            steps {
                // Using AWS credentials for Terraform configuration
                withCredentials([awsCredentials(credentialsId: "${AWS_CREDENTIALS_ID}")]) {
                    dir("${TF_DIR}") {
                        sh 'terraform init'  // Initialize Terraform configuration
                        sh 'terraform apply -auto-approve'  // Apply Terraform configuration
                    }
                }
            }
        }

        // Ansible - Configure EC2 infrastructure
        stage('Ansible - Configure Infrastructure') {
            steps {
                // Using AWS credentials for Ansible playbook execution
               withCredentials([awsCredentials(credentialsId: "aws-creds")]) {  // Use correct credentials ID
    dir("ansible") {  // Ensure this points to the directory where your playbook.yml and inventory.ini are located
        sh 'ansible-playbook -i inventory.ini playbook.yml'  // Run Ansible playbook
    }
}
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'  // Log out from Docker after the job finishes
        }
    }
}
