Zajęcia 07.06

1. definicja claim : 

apiVersion: v1
kind: PersistanceVolumeClaim

metadata:
	name: postgres-pvc
spec:
	accessMode:
		- ReadWriteOnce ( ReadWriteMany | ReadOnlyMany )
		
	resources:
		requests:
			storage: 100Mi   --> żądanie o 100 MB
		
* polecenie : kubectl apply -f ../my-cluster/pvc-definition.yml

mamy status bound, więc jest powołany z jakimś volumenem

* polecenie : screen ~/Library/Containers/com.docker.docker/Data/vns/0/tty

*polecenia :  kubectl get pvc 

* tworzymy test-pvc-deployment : 

apiVersion: v1

kind: Pod

metadata:
	name: test-pvc-pod
spec:
	containers:
		-image: alpine
		name: alpine
		command: ["/bin/sh", "-c"]
		args: ["echo Hello > /opt/data/hello.txt]
		
		volumeMounts:              --> nowość której bedziemy uzywac
			-mountPath: /opt/data  --> lokalnie
			name: data-volume
			
		volumes:
			-name: data-volume        --> po tej nazwie dopasuje
			persistentVolumeClaim:
				claimName: postgres-pvc
				

* polecenie : kubectl apply -f test-pvc-deployment.yml	

Na maszynie pojawił się plik hello.txt 

* kubectl get pods 
* kubectl delete pod test-pvc-pod
* docker exec -it ..... sh 

Usunelismy pod, uruchomil sie drugi raz, plik hello.txt cały czas istniał.
Potwierdzone empirycznie jak dynamicznie działa. 

* polecenie kubectl get sc (storage class) odpowiada za wybór rozwiązania
* kubectl get pv (persistent volume)(powinnismy zobaczyc volume ktory jest pod tym claimem)
* kubectl get pvc  ( z powyzszym odpowiednie 1:1) 

> Longhorn : dużo info znajdziemy 

* retain : dane pozostają 
* recycle : usunięcie zawartości 
* delete: dla bytów chmurowych AWS, Azure itd

Jak dostać się na maszynę : 
docker ps 
docker exec 
kubectl exec -it podname -sh 
Teraz zajmiemy się podłączeniem postgresa 


			
