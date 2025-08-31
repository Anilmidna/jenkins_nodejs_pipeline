pipeline {
  agent any
  triggers {
    // Use ONE: webhook (recommended) or polling
    githubPush()
    // pollSCM('H/5 * * * *')
  }
  options {
    timestamps()
    disableConcurrentBuilds()
  }
  environment {
    IMAGE_NAME = 'node-ci-cd-demo'
    APP_VERSION = "1.${BUILD_NUMBER}" // visible at /version
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build Docker Image') {
      steps {
        sh '''
          set -e
          docker build --build-arg BUILDKIT_INLINE_CACHE=1 \
            -t $IMAGE_NAME:${BUILD_NUMBER} \
            -t $IMAGE_NAME:latest .
        '''
      }
    }
    stage('Deploy') {
      steps {
        sh '''
          set -e
          # Stop old container if exists
          if [ "$(docker ps -aq -f name=node-ci-app)" ]; then
            docker rm -f node-ci-app || true
          fi

          # Run new container mapping host 80 -> container 3000
          docker run -d --name node-ci-app \
            -e APP_VERSION=$APP_VERSION \
            -p 80:3000 \
            $IMAGE_NAME:latest
        '''
      }
    }
stage('Smoke Test') {
  steps {
    sh '''
      set -e
      for i in {1..30}; do
        if curl -fsS http://localhost/health >/dev/null; then
          echo "Health OK"; exit 0
        fi
        echo "[$i/30] Waiting for app..."
        docker logs --tail 20 node-ci-app || true
        sleep 2
      done
      echo "App did not become healthy in time"
      docker logs node-ci-app || true
      exit 1
    '''
  }
}
  post {
    success {
      echo "Deployed. Hit http://<EC2-Public-IP>/ and /version"
    }
    failure {
      echo "Build failed. Check console."
    }
  }
}
