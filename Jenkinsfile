pipeline {
    agent any
       environment {
        DOCKER_IMAGE = 'naveennallamsetti/java_flames'
    }
    stages {
        stage('Stage Check out') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'naveengit', url: 'https://github.com/naveennallamsetti/flames.git']])
            }
        }
        stage('Stage validate') {
            steps {
                sh 'mvn validate'
            }
        }
        stage('Stage compile') {
            steps {
                sh 'mvn compile'
            }
        }
        stage('Stage test') {
            steps {
                sh 'mvn test'
            }
        }
        stage('Stage Package') {
            steps {
                sh 'mvn package'
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
                sh 'docker push $DOCKER_IMAGE:latest'
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {

                    sh '''
                    export KUBECONFIG=$KUBECONFIG

                    # Create namespace if not exists
                    kubectl get ns $NAMESPACE || kubectl create ns $NAMESPACE

                    # Apply manifests
                    kubectl apply -f k8s/namespace.yaml || true
                    kubectl apply -f k8s/deployment.yaml -n $NAMESPACE
                    kubectl apply -f k8s/service.yaml -n $NAMESPACE

                    # Update image dynamically
                    kubectl set image deployment/flames-app \
                    flames-container=$IMAGE_NAME:$BUILD_NUMBER \
                    -n $NAMESPACE

                    # Wait for rollout
                    kubectl rollout status deployment/flames-app -n $NAMESPACE
                    '''
                }
            }
    }
}
