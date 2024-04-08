dotnet --list-sdks

dotnet new web -o api -f net8.0
dotnet add package Microsoft.EntityFrameworkCore.InMemory --version 8.0
