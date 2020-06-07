# MOJE NOTATKI Z ZAJĘĆ

Kontener uruchomiony -> proces
Image -> plik ze "źródłem kontenera"
$docker run hello-world

W systemie mamy dwie wkładowe : 
1. Docker deamon (server) - proces systemowy, odpięty od terminala (API restowe)
2. Docker CLI(command line, interface, komunikuje się z deamonem, wydając mu polecenia. 
3. Należy pamiętać aby wraz ze startem uruchomić docker deamon.
4. docker info : Conteiners:2 ilość kontenerów
5. docker system pure : czyści kontenery
6. docker ps -all wyświetla kontenery
7. Image : binarka, plik, składa się z file system : swój własny system (cmd echo hello)
8. Container - uruchomiony jest "procesorem"
9. sudo dhclient : polecenie do podniesienia sieci





1. docker info : 

IMAGE                          CONTAINER
"BINARKA"                      Uruchomiony jest procesem     
PLIK

 FS   ######   CMD   ###   </br>
   /var/lib    echo Hello   </br>
#############################   
   
   
   DOCKER CLI --> DOCKER DAEMON SERVER (jeden przekazuje informację, wydaje polecenia drugiemu)
   
   
   * docker ps : pokazuje uruchomione kontenery 
   * docker ps -a  wszystkie kontenery, które mieliśmy uruchomione + ich stan 
   Najczęściej posługujemy się CONTAINER ID (alternatywnie NAMES (names są losowo nadawane)
   STATUS : Gdy mamy 0 to zakończony bez błędów, każda inna wartość oznacza błąd. 
   
   * docker run busybox (busybox nazwa image) echo Hello
   * docker images : pokazuje jakie mamy ściągnięte images 
   Jeśli mamy w cache lokalnym to z niego brany, inaczej z docker hub pobierane jest.
   * docker system prune -a : czyści containery i images ( po wyczyszczeniu w momencie uruchomienia docker run busybox echo Hello, pobiera busybox z docker hub przy pierwszym uruchomieniu 
   3 razy uruchomione daje nam przy poleceniu docker ps -a 3 kontenery (z CONTAINER ID, NAMES, IMAGE, COMMAND, CREATED, STATUS)
   
   * docker run image MyCMD ---> podmienia CMD, trzeba uważać bo serwer nie wystartuje 
   * docker run busybox sleep 1000 
   i wtedy w drugim terminalu widzimy go uruchamiając komendę docker ps 
   
   * docker exec -it "tu dajemy skopiowane CONTAINER ID" sh   
   * docker run redis 
   * redis-cli : klient do serwera redis (zamiast shella) 
   * set message Hello  -> get message (prosty cache : klucz:wartość) 
   * docker stop CONTAINER_ID : zatrzymuje działanie 
   * Gdy SIGTERM nie zadziała, to po 10s puszcza sygnał SIGKILL (kill -9)
   * docker start - a CONTAINER_ID : startujemy wcześniej zastopowany container
   * docker logs CONTAINER_ID : zwraca logi od pierwszego uruchomienia CONTAINER_ID
   
PROCESS : 
a) STDIN
b) STDOUT
c) STDERR

* docker exec -i CONTAINER_ID
* docker exec -it CONTAINER_ID : daje nam pseudoTerminal 


TWORZENIE IMAGE 

* vi Dockerfile
* 
FROM busybox (image bazowej dystrybucji)
CMD echo Hello from my busybox


* docker build -t helloWorldBusyBox:latest .
* docker run helloWorldBusyBox : zwróci nam napis Hello world from my busybox.
* docker images : zwróci nam images 


* docker build -t DOCKER_HUB_ID/mybbox:latest . (pamiętać zawsze o tej kropce na samym końcu przy buid)
* docker push DOCKER_HUB_ID/mybbox:latest    (DOCKER_HUB_ID/NAZWA_REPOZYTORIUM) 


NGINX 
*docker run nginx 
* docker run -p 90:80 nginx   i wtedy w przeglądarce localhost:90  (gdzie 90 to lokalny port, a 80 CONTAINER port) 


############################################################################################################################################################################################

docker run -p 90:80 nginx : 90 to port lokalny, potem wewnatrz kontenera
W ten sposób dostajemy sie do dzialajacych kontenerow 
docker build .
 npm install
 npm run start
(du -hs node_modules)
docker ps
docker exec -it "container id dajemy"
budujemy : docker build .

 otworzenie w vi : vi nazwa pliku ze sciezka
 App.test.js : nasz test 
npm init -v (stworzenie aplikacji node)

yarn dev : uruchomienie 

############################################################################################################################################################################################

1. instalacja minikube
2. mozna tez w docker desktop enable kubernetes


polecenia dla kubernetesa :

* kubectl cluster-info
* kubectl config current-context 
* kubectl get pods 
* polecenie : kubectl create -f pod-template.yml
* kubectl get pods
* kubectl create -f pod-template.yml

############################################################################################################################################################################################

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


