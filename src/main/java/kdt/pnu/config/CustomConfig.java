package kdt.pnu.config;

import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Component
public class CustomConfig implements WebMvcConfigurer {
	@Override
	public void addCorsMappings(@NonNull CorsRegistry registry) {
		registry.addMapping("/**")
		.allowedMethods(CorsConfiguration.ALL)
		.allowedOrigins(CorsConfiguration.ALL)
		.exposedHeaders(HttpHeaders.AUTHORIZATION); 		
	}
	
}
