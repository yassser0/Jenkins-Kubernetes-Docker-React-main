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

        stage('Docker Login & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', 
                                                 usernameVariable: 'DOCKERHUB_USR', 
                                                 passwordVariable: 'DOCKERHUB_PSW')]) {
                    script {
                        sh '''
                          echo "$DOCKERHUB_PSW" | docker login --username "$DOCKERHUB_USR" --password-stdin
                          docker push yasser825/jenkins-kubernetes-docker-react:latest
                        '''
                    }
                }
            }
        }

        stage('Update Kubernetes Deployment') {
            steps {
                script {
                    sh '''
                        export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
                        kubectl set image deployment/jenkins-kubernetes-docker-react-deployment jenkins-kubernetes-docker-react=yasser825/jenkins-kubernetes-docker-react:latest
                        kubectl rollout restart deployment/jenkins-kubernetes-docker-react-deployment
                        kubectl rollout status deployment/jenkins-kubernetes-docker-react-deployment
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
