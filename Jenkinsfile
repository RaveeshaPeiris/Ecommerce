pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = "dockerhub-creds" // Set this up in Jenkins > Manage Jenkins > Credentials
        FRONTEND_IMAGE = "raveeshapeiris/ecommerce-frontend"
        BACKEND_IMAGE = "raveeshapeiris/ecommerce-backend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/RaveeshaPeiris/Ecommerce.git'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $FRONTEND_IMAGE:$BUILD_NUMBER ./frontend'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t $BACKEND_IMAGE:$BUILD_NUMBER ./backend'
            }
        }

        stage('Login to Docker Hub') {
    steps {
        withCredentials([usernamePassword(
            credentialsId: 'test-dockerhub',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
        )]) {
            sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
        }
    }
}


        stage('Push Frontend & Backend') {
            steps {
                sh 'docker push $FRONTEND_IMAGE:$BUILD_NUMBER'
                sh 'docker push $BACKEND_IMAGE:$BUILD_NUMBER'
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}
