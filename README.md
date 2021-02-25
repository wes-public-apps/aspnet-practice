# aspnet-practice

# Development Notes
**Docker Management**
There are two containers: one for production and one for development. The development container binds source code to the container and uses file watchers to ensure more rapid development.

Add Dev Container to Registry:
We want to only build the development container once so we will add it to a local registry. That way if we need to we can easily start a fresh container but will not ahve to waste time rebuilding the image.
* create local registry by running "sudo docker run -d -p 5000:5000 --name registry registry:latest" if it does not exist. Otherwise "sudo docker start registry"
* from root directory location run "sudo docker build -t localhost:5000/aspnet-react-dev-container -f ./Containers/Dev/Dockerfile ."
* push image to registry to prevent need to rebuild again "sudo docker push localhost:5000/aspnet-react-dev-container"
* make sure docker-compose uses image in registry.
In the future no build will be necessary at all. The image will be hosted on a global registry. 

## Project Creation
Javascript: https://docs.microsoft.com/en-us/aspnet/core/tutorials/signalr?tabs=visual-studio-code&view=aspnetcore-5.0 
Typescript: https://docs.microsoft.com/en-us/aspnet/core/tutorials/signalr-typescript-webpack?view=aspnetcore-5.0