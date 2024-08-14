//package kdt.pnu.service;
//
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//public class WeatherService {
//
//	private final WeatherRepository weatherRepo; 
//	private final RestTemplate restTemplate; 
//
//
//
////	public void fetchData(String url) {
////		try {		
////			
////			HttpHeaders headers = new HttpHeaders();
////	        headers.set("Accept", "application/json"); // Set the Accept header
////
////	        HttpEntity<String> entity = new HttpEntity<>(headers);
////	        ResponseEntity<WeatherResponse> responseEntity = restTemplate.exchange(url, HttpMethod.GET, entity, WeatherResponse.class);
////	        
////	        System.out.println(responseEntity.getBody().toString()); // Get the body of the response
////
////
////			ResponseEntity<?> response = restTemplate.getForEntity(url, WeatherResponse.class);
////			System.out.println("헤더:: " + response.getHeaders().toString());
////			System.out.println("보디:: " + response.getBody().toString());
////			
////			
////			
////			
////			
////			//		HttpHeaders headers = new HttpHeaders();
////			//		headers.set("Content-Type", "application/json");
////			//		
////			//		HttpEntity<String> entity = new HttpEntity<>(headers);
////
////			//      ResponseEntity<WeatherResponse> response = restTemplate.exchange(url, HttpMethod.GET, entity, WeatherResponse.class);
////			//		restTemplate.exchange(url, HttpMethod.GET, entity, WeatherResponse.class);
////			//      WeatherResponse weatherResponse = response.getBody();
////
////			
////			
////			
////			
////			
//////			WeatherResponse weatherResponse = restTemplate.getForObject(url, WeatherResponse.class);
//////
//////
//////			JsonNode jsonNode = restTemplate.getForObject(url, JsonNode.class);
//////			log.info("Raw JSON Response: " + jsonNode.toString());
//////			//			
//////
//////			System.out.println("리스폰스:: " + weatherResponse);
//////			System.out.println(weatherResponse.getResponse().toString());
////
////		} catch (Exception e) {
////			System.out.println("에러");
////			e.printStackTrace();
////		}	
////		//		return null; 
////	}
//
//}
