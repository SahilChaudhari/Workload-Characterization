**Installation of Docker** 

- ```sudo apt update```
- ```sudo apt install apt-transport-https ca-certificates curl software-properties-common```
- ```curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -```
- ```sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"```
- ```sudo apt update```
- ```apt-cache policy docker-ce``` (Check the output : It must have Candidate: 5:20.10.6~3-0~ubuntu-bionic )
- ```sudo apt install docker-ce```
- Check the status using ```sudo systemctl status docker```

**Using Dockor**
- Finding options for dockor build ```docker build --help```

- Dockor by default operates as root. So it requires sudo in front of all the commands.

- Right now I am in the ```/OELP/OELP-cloud-based-web-application/app```, so  for building the Dockor image, the command was ```sudo docker build --tag server_image .```.

- Using Docker commands

- - ```sudo docker images``` to see the list of images in Docker
- - ```sudo docker ps``` to see the list of instances of the images that you have run
- - ```sudo docker ps -a``` shows the list of images that you have stopped but have not been removed explicitely.
- - ```sudo docker stop instance_name``` stop a runnning instance of the image
- -  ```sudo docker run -p 8000:80 --name server_instance -d server_image``` -d carries the image name whose instance you want to create. -p tells about port redirection.
- - To see the logs created by the instance ```sudo docker logs instance_names```

- - To enter into the container  ```docker exec -it container_id bash``` 