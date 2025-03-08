pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/yassser0/Jenkins-Kubernetes-Docker-React-main'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t yasser825/jenkins-kubernetes-docker-react:latest .'
                }
            }
        }
        stage('Docker Push') {
            steps {
                script {
                    sh '''
                        echo "$DOCKERHUB_PSW" | docker login --username "$DOCKERHUB_USR" --password-stdin
                        docker push yasser825/jenkins-kubernetes-docker-react:latest
                    '''
                }
            }
        }
        stage('Deploy to K3s') {
            steps {
                script {
                    sh '''
                        sudo KUBECONFIG=/etc/rancher/k3s/k3s.yaml kubectl set image deployment/todoappproject-deployment todoappproject-container=yasser825/jenkins-kubernetes-docker-react:latest
                        sudo KUBECONFIG=/etc/rancher/k3s/k3s.yaml kubectl rollout restart deployment/todoappproject-deployment
                        sudo KUBECONFIG=/etc/rancher/k3s/k3s.yaml kubectl rollout status deployment/todoappproject-deployment
                    '''
                }
            }
        }
    }
    post {
        failure {
            echo 'Deployment failed.'
        }
        success {
            echo 'Deployment succeeded!'
        }
    }
}
