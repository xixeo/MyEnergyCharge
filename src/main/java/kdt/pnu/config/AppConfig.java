package kdt.pnu.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

@Configuration
class AppConfig {

	@Bean
	RestTemplate restTemplate() {
		RestTemplate restTemplate =  new RestTemplate();		

		List<HttpMessageConverter<?>> messageConverters = new ArrayList<>();
		messageConverters.add(new MappingJackson2HttpMessageConverter()); // JSON converter
		messageConverters.add(new MappingJackson2XmlHttpMessageConverter()); // XML converter
		restTemplate.setMessageConverters(messageConverters);

		return restTemplate;
	}

}
