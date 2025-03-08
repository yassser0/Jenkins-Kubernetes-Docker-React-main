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
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', 
                                                 usernameVariable: 'DOCKERHUB_USR', 
                                                 passwordVariable: 'DOCKERHUB_PSW')]) {
                    script {
                        if (isUnix()) {
                            sh '''
                              echo "$DOCKERHUB_PSW" | docker login --username "$DOCKERHUB_USR" --password-stdin
                              docker push yasser825/jenkins-kubernetes-docker-react:latest
                            '''
                        } else {
                            bat 'docker login --username %DOCKERHUB_USR% --password %DOCKERHUB_PSW%'
                            bat 'docker push yasser825/jenkins-kubernetes-docker-react:latest'
                        }
                    }
                }
            }
        }

        stage('Deploy to K3s') {
            steps {
                script {
                    sh '''
                        export KUBECONFIG=/etc/rancher/k3s/k3s.yaml  # Use K3s config
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
