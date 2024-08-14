package kdt.pnu;

import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class CheckContentType {	

	public static void checkContentType(String url) {
	    RestTemplate restTemplate = new RestTemplate();

	    try {
	        // Making a HEAD request to check the content type
	        ResponseEntity<Void> response = restTemplate.exchange(url, HttpMethod.HEAD, null, Void.class);

	        // Extracting the Content-Type header
	        String contentType = response.getHeaders().getContentType().toString();
	        System.out.println("Content-Type: " + contentType);
	        
	    } catch (Exception e) {
	        e.printStackTrace();
	        System.err.println("Error fetching data from URL: " + e.getMessage());
	    }
	}
	
	public static void main(String[] args) {

		String url = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=5z6tzpaw1QvVPUuJx0oqunW1oo5VZ4A552Mb8LOcEwDbMOsiQCt1KzaZpK9u%2BHM8WauNtRrz6%2BMDNeCyEmY9Qg%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=20240801&base_time=0600&nx=55&ny=127";
		checkContentType(url);
	}

}
