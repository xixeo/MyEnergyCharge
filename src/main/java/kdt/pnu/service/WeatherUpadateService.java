package kdt.pnu.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import kdt.pnu.domain.Weather;
import kdt.pnu.domain.WeatherResponse;
import kdt.pnu.domain.WeatherResponse.Response.Body.Items.Item;
import kdt.pnu.persistence.WeatherRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WeatherUpadateService {

	private final RestTemplate restTemplate; 
	private final ObjectMapper objectMapper; 
	private final WeatherRepository weatherRepo; 

	public void fetchData(String city, String county, Double baseDate, Integer baseTime) { 
		
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.set("Accept", "*/*;q=0.9");

		String url = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst"
				+ "?serviceKey=5z6tzpaw1QvVPUuJx0oqunW1oo5VZ4A552Mb8LOcEwDbMOsiQCt1KzaZpK9u%2BHM8WauNtRrz6%2BMDNeCyEmY9Qg%3D%3D"
				+ "&pageNo=1&numOfRows=1000&dataType=JSON&base_date=20240821&base_time=0600&nx=98&ny=76";
		String responseJSON = restTemplate.getForObject(url, String.class);

		try {
			WeatherResponse wResponse = objectMapper.readValue(responseJSON, WeatherResponse.class);
			System.out.println(wResponse.toString());
			processSaveItems(wResponse.getResponse().getBody().getItems().getItem(),
					city, county, baseDate, baseTime);
		} catch(Exception e) {
			e.printStackTrace();
		}
	}

	public void processSaveItems(List<Item> items,
			String city, String county, Double baseDate, Integer baseTime) {

		if (items.isEmpty()) return; 

		Map<String, String> dataMap = new HashMap<>();

		for (Item item: items) {
			if("REH".equals(item.getCategory()) || "T1H".equals(item.getCategory()) || "WSD".equals(item.getCategory()))
				dataMap.put(item.getBaseDate(), item.getObsrValue());							
		}

		if(dataMap.containsKey("REH") && dataMap.containsKey("T1H") && dataMap.containsKey("WSD")) {
			Double tmpr = Double.parseDouble(dataMap.get("T1H")); 
			Double rhwt = Double.parseDouble(dataMap.get("REH"));
			Double ws = Double.parseDouble(dataMap.get("WSD"));

			Weather weather = Weather.builder()
					.date(LocalDate.parse(String.format("%.0f", baseDate), DateTimeFormatter.ofPattern("yyyyMMdd")))
					.hour(baseTime)
					.tmpr(tmpr)
					.rhwt(rhwt)
					.ws(ws)
					.city(city)
					.county(county)
					.build();

			weatherRepo.save(weather);
		} else { 
			System.out.println("===> There is some missing data from the url");
		}		
	}

}
