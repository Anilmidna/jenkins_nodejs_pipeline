pipeline {
  agent any

  triggers {
    // Use ONE trigger: webhook (recommended) or polling
    githubPush()
    // pollSCM('H/5 * * * *')
  }

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    IMAGE_NAME     = 'node-ci-cd-demo'
    CONTAINER_NAME = 'node-ci-app'
    APP_VERSION    = "1.${BUILD_NUMBER}"   // exposed at /version if you use it
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        sh '''
          set -e
          docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} -t ${IMAGE_NAME}:latest .
        '''
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          set -e
          # Stop & remove any old container with the same name
          if [ "$(docker ps -aq -f name=^${CONTAINER_NAME}$)" ]; then
            docker rm -f ${CONTAINER_NAME} || true
          fi

          # Run new container (container listens on 3000; publish on host 80)
          docker run -d --name ${CONTAINER_NAME} \
            -e APP_VERSION=${APP_VERSION} \
            -p 80:3000 \
            ${IMAGE_NAME}:latest
        '''
      }
    }

    stage('Smoke Test') {
      steps {
        sh '''
          set -e
          # Retry /health until ready (about 60s max)
          for i in {1..30}; do
            if curl -fsS http://localhost/health >/dev/null; then
              echo "Health OK"
              exit 0
            fi
            echo "[$i/30] waiting for app to become ready..."
            sleep 2
          done

          echo "Timed out waiting for /health"
          docker logs --tail 200 ${CONTAINER_NAME} || true
          exit 1
        '''
      }
    }
  }

  post {
    success {
      echo "Deployed successfully. Hit http://<EC2-PUBLIC-IP>/ and /version"
    }
    failure {
      echo "Build failed. Check logs above."
    }
  }
}
