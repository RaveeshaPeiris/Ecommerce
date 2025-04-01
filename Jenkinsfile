pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = "dockerhub-creds"
        FRONTEND_IMAGE = "raveeshapeiris/ecommerce-frontend"
        BACKEND_IMAGE = "raveeshapeiris/ecommerce-backend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-creds',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_PAT'
                )]) {
                    sh '''
                        git config --global credential.helper store
                        git clone https://$GIT_USER:$GIT_PAT@github.com/RaveeshaPeiris/Ecommerce.git
                        cd Ecommerce
                        ls -la
                    '''
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('Ecommerce/frontend') {
                    sh 'docker build -t $FRONTEND_IMAGE:$BUILD_NUMBER .'
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('Ecommerce/backend') {
                    sh 'docker build -t $BACKEND_IMAGE:$BUILD_NUMBER .'
                }
            }
        }

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
