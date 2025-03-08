pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Check out the 'master' branch from your GitHub repository
                git branch: 'master', url: 'https://github.com/yassser0/Jenkins-Kubernetes-Docker-React-main'
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
                script {
                    if (isUnix()) {
                        sh '''
                          docker login --username "yasser825" --password "your-dockerhub-password"
                          docker push yasser825/jenkins-kubernetes-docker-react:latest
                        '''
                    } else {
                        // On Windows, use environment variables for security
                        bat 'docker login --username "yasser825" --password "your-dockerhub-password"'
                        bat 'docker push yasser825/jenkins-kubernetes-docker-react:latest'
                    }
                }
            }
        }
        stage("Update Kubernetes Deployment") {
           steps {
                echo "Updating Kubernetes Deployment..."
                script {
                    sh '''
                        export KUBECONFIG=/home/azureuser/.kube/config  # Ensure this path is correct
                        kubectl set image deployment/todoappproject-deployment todoappproject-container=yasser825/jenkins-kubernetes-docker-react:latest --record
                        kubectl rollout restart deployment/todoappproject-deployment
                        kubectl rollout status deployment/todoappproject-deployment
                    '''
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
