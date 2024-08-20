package kdt.pnu;

import org.springframework.web.client.RestTemplate;

public class WeatherUpdate {
	
	static RestTemplate restTemplate = new RestTemplate(); 
	
	public static void main(String[] args) {
		
	
	 
		String url = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=5z6tzpaw1QvVPUuJx0oqunW1oo5VZ4A552Mb8LOcEwDbMOsiQCt1KzaZpK9u%2BHM8WauNtRrz6%2BMDNeCyEmY9Qg%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=20240820&base_time=1000&nx=98&ny=76" ;

		
		try {String response = restTemplate.getForObject(url, String.class);
			System.out.println(response);
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
}
