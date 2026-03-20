pipeline {
    agent any

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
    }
}
