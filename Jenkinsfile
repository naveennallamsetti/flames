pipeline {
    agent any

    environment {
        IMAGE_NAME = 'naveennallamsetti/java_flames'
        NAMESPACE = 'flames-ns'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'naveengit',
                    url: 'https://github.com/naveennallamsetti/flames.git'
            }
        }

        stage('Build WAR') {
            steps {
                sh 'mvn clean package'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER .'
                sh 'docker tag $IMAGE_NAME:$BUILD_NUMBER $IMAGE_NAME:latest'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'naveendocker',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push $IMAGE_NAME:$BUILD_NUMBER'
                sh 'docker push $IMAGE_NAME:latest'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh '''
                    export KUBECONFIG=$KUBECONFIG

                    kubectl get ns $NAMESPACE || kubectl create ns $NAMESPACE

                    kubectl apply -f k8s/deployment.yaml -n $NAMESPACE
                    kubectl apply -f k8s/service.yaml -n $NAMESPACE

                    kubectl set image deployment/flames-app \
                    flames-container=$IMAGE_NAME:$BUILD_NUMBER \
                    -n $NAMESPACE

                    kubectl rollout status deployment/flames-app -n $NAMESPACE
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '🚀 Deployment Successful'
        }
        failure {
            echo '❌ Pipeline Failed'
        }
    }
}
