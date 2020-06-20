cd backend
docker build -t mpyszynska/mybackend .
docker push mpyszynska/mybackend
cd ../
cd frontend
docker build -t mpyszynska/myfrontend .
docker push mpyszynska/myfrontend
cd ../
kubectl apply -f https://raw.githubusercontent.com/cluster/ingress-nginx/master/deploy/static/provider/cloud/deploy.yaml
kubectl apply -f cluster/app-configmap.yml
kubectl apply -f cluster/postgres-secret.yml
kubectl apply -f cluster/postgres-pvc.yml
kubectl apply -f cluster/postgres-deployment.yml
kubectl apply -f cluster/postgres-service-clusterip.yml
kubectl apply -f cluster/redis-deployment.yml
kubectl apply -f cluster/redis-service-clusterip.yml
kubectl apply -f cluster/mybackend-deployment.yml
kubectl apply -f cluster/mybackend-service-clusterip.yml
kubectl apply -f cluster/myfrontend-deployment.yml
kubectl apply -f cluster/myfrontend-service-clusterip.yml
kubectl apply -f cluster/ingress-service.yml