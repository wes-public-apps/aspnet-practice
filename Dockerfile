FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build

#install npm in build
RUN apt update -yq && apt upgrade -yq && apt install -yq curl git nano
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && apt install -yq nodejs build-essential
RUN npm install

WORKDIR /src
COPY ["ReactWebApp/ReactWebApp.csproj", "ReactWebApp/"]
RUN dotnet restore "ReactWebApp/ReactWebApp.csproj"
COPY . .
WORKDIR "/src/ReactWebApp"

RUN dotnet build "ReactWebApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ReactWebApp.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ReactWebApp.dll"]