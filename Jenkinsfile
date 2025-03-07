pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Check out the 'main' branch from your GitHub repository
                git branch: 'main', url: 'https://github.com/yassser0/Jenkins-Kubernetes-Docker-React-main'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker build -t yasser825/jenkins-kubernetes-docker-react:latest .'
                    } else {
                        bat 'docker build -t yasser825/jenkins-kubernetes-docker-react:latest .'
                    }
                }
            }
        }
        stage('Docker Login & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USR', passwordVariable: 'DOCKERHUB_PSW')]) {
                    script {
                        if (isUnix()) {
                            sh '''
                              echo "$DOCKERHUB_PSW" | docker login --username "$DOCKERHUB_USR" --password-stdin
                              docker push yasser825/jenkins-kubernetes-docker-react:latest
                            '''
                        } else {
                            // On Windows, reference environment variables with %VAR%
                            bat 'docker login --username %DOCKERHUB_USR% --password %DOCKERHUB_PSW%'
                            bat 'docker push yasser825/jenkins-kubernetes-docker-react:latest'
                        }
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    script {
                        if (isUnix()) {
                            sh '''
                              kubectl apply -f react-dpl.yml --validate=false
                              kubectl rollout status deployment/jenkins-kubernetes-docker-react-deployment
                            '''
                        } else {
                            bat 'kubectl apply -f react-dpl.yml --validate=false'
                            bat 'kubectl rollout status deployment/jenkins-kubernetes-docker-react-deployment'
                        }
                    }
                }
            }
        }
    }
    post {
        failure {
            echo 'The pipeline failed.'
        }
        success {
            echo 'Deployment succeeded!'
        }
    }
}
