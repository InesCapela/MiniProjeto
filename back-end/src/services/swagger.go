package services

import "api/docs"

func FormatSwagger() {
	//http://localhost:8081/swagger/index.html
	docs.SwaggerInfo.Title = "API Template"
	docs.SwaggerInfo.Description = "Essa api é um template."
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = "localhost:8081"
	docs.SwaggerInfo.BasePath = "/api/v1"
	docs.SwaggerInfo.Schemes = []string{"http", "https"}
}
