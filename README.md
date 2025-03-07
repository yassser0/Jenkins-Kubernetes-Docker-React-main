
# Jenkins Kubernetes Docker React

## Overview

**Jenkins Kubernetes Docker React** is a containerized Todo application built with React and Vite. This project demonstrates a full CI/CD workflow that integrates Docker, Kubernetes, and Jenkins. The Jenkins pipeline automates the entire process—from building a Docker image and pushing it to Docker Hub, to deploying the application on a Kubernetes cluster (using Minikube locally).

## Features

- **React Todo App:** A single-file React application with features such as add, edit, delete, mark as complete, and clear all todos.
- **Containerized:** Built using a Dockerfile with Vite, resulting in a lightweight container image.
- **CI/CD Pipeline:** Automated build, push, and deployment using Jenkins.
- **Kubernetes Deployment:** Uses a declarative Kubernetes manifest to deploy the application on a local Minikube cluster.
- **Integration:** Seamlessly integrates Docker Hub for image storage, Jenkins for CI/CD, and Minikube for Kubernetes deployment.

## Prerequisites

- **Docker:** Installed and running.
- **Minikube:** Installed and running locally.
- **kubectl:** Command-line tool for interacting with Kubernetes.
- **Jenkins:** Set up with the following credentials:
  - **Docker Hub Credential:** (ID: `dockerhub-credentials`)
  - **kubeconfig File:** Uploaded as a secret file (ID: `kubeconfig`)
- **Git:** For source control.

## Jenkins Pipeline Details

The Jenkins pipeline is defined in the `Jenkinsfile` and consists of the following stages:

1. **Checkout Stage:**
   - Clones the latest code from the GitHub repository:
   
     ```
     https://github.com/Saisamarth21/Jenkins-Kubernetes-Docker-React.git
     ```
     
   - Checks out the `main` branch.

2. **Build Docker Image Stage:**
   - Builds the Docker image using the Dockerfile.
   - Tags the image as `saisamarth21/jenkins-kubernetes-docker-react:latest`.
   - Command used:
     
     ```bash
     docker build -t saisamarth21/jenkins-kubernetes-docker-react:latest .
     ```

3. **Docker Login & Push Stage:**
   - Logs into Docker Hub using Jenkins credentials.
   - Pushes the newly built image to Docker Hub.
   - Commands used:
     
     ```bash
     docker login --username <username> --password <password>
     docker push saisamarth21/jenkins-kubernetes-docker-react:latest
     ```

4. **Deploy to Kubernetes Stage:**
   - Uses `kubectl apply -f react-dpl.yml --validate=false` to deploy or update the Kubernetes resources.
   - Verifies the deployment with:
     
     ```bash
     kubectl rollout status deployment/jenkins-kubernetes-docker-react-deployment
     ```

## Jenkinsfile Example

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Check out the 'main' branch from your GitHub repository
                git branch: 'main', url: 'https://github.com/Saisamarth21/Jenkins-Kubernetes-Docker-React.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker build -t saisamarth21/jenkins-kubernetes-docker-react:latest .'
                    } else {
                        bat 'docker build -t saisamarth21/jenkins-kubernetes-docker-react:latest .'
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
                              docker push saisamarth21/jenkins-kubernetes-docker-react:latest
                            '''
                        } else {
                            bat 'docker login --username %DOCKERHUB_USR% --password %DOCKERHUB_PSW%'
                            bat 'docker push saisamarth21/jenkins-kubernetes-docker-react:latest'
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
```

### Kubernetes Manifest (react-dpl.yml)


```groovy
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jenkins-kubernetes-docker-react-deployment
  labels:
    app: jenkins-kubernetes-docker-react
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jenkins-kubernetes-docker-react
  template:
    metadata:
      labels:
        app: jenkins-kubernetes-docker-react
    spec:
      containers:
      - name: jenkins-kubernetes-docker-react
        image: saisamarth21/jenkins-kubernetes-docker-react:latest   
        ports:
        - containerPort: 4173
---
apiVersion: v1
kind: Service
metadata:
  name: jenkins-kubernetes-docker-react-service
spec:
  type: NodePort
  selector:
    app: jenkins-kubernetes-docker-react
  ports:
  - protocol: TCP
    port: 80
    targetPort: 4173
    nodePort: 30080

```

----

### DockerFile 

```
# Stage 1: Build the React app using Vite
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code and build
COPY . .
RUN npm run build

# Stage 2: Run the production build using Vite's preview
FROM node:18-alpine
WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app .

# Ensure Vite's preview server listens on all interfaces
ENV HOST=0.0.0.0

# Expose the default Vite preview port (4173)
EXPOSE 4173

# Start the preview server with the --host flag
CMD ["npm", "run", "preview", "--", "--host"]

```


## How to Run Locally


1. **Build the Docker Image:**

```bash
docker build -t saisamarth21/jenkins-kubernetes-docker-react:latest .
```

2. **Push the Image to Docker Hub:**

```bash
docker login --username saisamarth21
docker push saisamarth21/jenkins-kubernetes-docker-react:latest
```

3. **Deploy to Minikube:**

- Start Minikube if it isn’t already running:

```bash
minikube start
```

- Apply the Kubernetes manifest:

```bash
kubectl apply -f react-dpl.yml --validate=false
```

- Verify the deployment:

```bash
kubectl get pods
kubectl get services
```

- Access the application (e.g., using the minikube service command):

```bash
minikube service jenkins-kubernetes-docker-react-service
```

## Screenshots


- **Docker Hub:** [Link](https://hub.docker.com/r/saisamarth21/jenkins-kubernetes-docker-react)
  ![Screenshot 2025-02-22 224733](https://github.com/user-attachments/assets/b87e1034-be2a-4b64-b590-b6881a914c09)


- **Jenkins Dashboard:** Screenshot showing the successful pipeline run.
   ![Screenshot 2025-02-22 224854](https://github.com/user-attachments/assets/f091be57-95a4-449c-8b95-a1bbe4250ce3)
   ![Screenshot 2025-02-22 163416](https://github.com/user-attachments/assets/e3359baf-3509-42f4-a427-2b38cc2c042d) 


- **Terminal Output:** Screenshots before and after deployment (e.g., `kubectl get pods` and `kubectl get services`).

- **Before Pipeline**

 ![Screenshot 2025-02-22 163015](https://github.com/user-attachments/assets/7876abeb-1cf9-4363-b63c-e53e5d8a6bc0)


- **After Pipeline**

 ![Screenshot 2025-02-22 163126](https://github.com/user-attachments/assets/0f98055e-28e2-4509-9ab6-586d1d997c2f)


