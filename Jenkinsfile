pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Check out the 'main' branch from your GitHub repository
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
        stage("Update Kubernetes Deployment") {
           steps {
                echo "Updating Kubernetes Deployment..."
                script {
                    sh '''
                   export KUBECONFIG=/home/azureuser/.kube/config   # Adjust the path if necessary
                   kubectl set image deployment/todoappproject-deployment todoappproject-container=achrafbrini007/todoappproject:latest --record
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
