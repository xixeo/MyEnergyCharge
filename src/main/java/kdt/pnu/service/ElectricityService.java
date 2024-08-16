package kdt.pnu.service;


import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import kdt.pnu.domain.dto.ElectricityDTO;
import kdt.pnu.persistence.ElectricityRepository;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class ElectricityService {
	
	private final ElectricityRepository ElectricityRepo; 
	
	public List<ElectricityDTO> findByDateCityCounty(String date, String city, String county) {
		List<Object[]> list = ElectricityRepo.findByDateCityCounty(date, city, county);
		List<ElectricityDTO> ret = new ArrayList<>();		
		for (Object[] objs : list) {
			ret.add(ElectricityDTO.builder()
					.date(objs[0].toString())
					.city(objs[1].toString())
					.county(objs[2].toString())
					.max_temp(Double.parseDouble(objs[3].toString()))
					.min_temp(Double.parseDouble(objs[4].toString()))
					.avg_temp(Double.parseDouble(objs[5].toString()))
					.max_rh(Double.parseDouble(objs[6].toString()))
					.min_rh(Double.parseDouble(objs[7].toString()))
					.avg_rh(Double.parseDouble(objs[8].toString()))
					.di(objs[9] != null ? Double.parseDouble(objs[10].toString()) : 0.0)
					.elec_avg(Double.parseDouble(objs[10].toString()))
					.build());
		}

		return ret;
	}
	
	
}
	
	
	
	
	
	
	
	
	
	
//	private final RestTemplate restTemplate; 
//
//	private String url = "https://bigdata.kepco.co.kr/openapi/v1/powerUsage/houseAve.do?year=2024&month=05&metroCd=11&apiKey=YQl8K8o7Tcol37VRK4S9lNSx44X31cK8Q6Do4WHB&returnType=json";
//
//	public void fetchData() {
//		try { 
//			HttpHeaders headers = new HttpHeaders();
//			headers.set("Accept", "application/json"); // Set Accept header for JSON
//
//			HttpEntity<String> entity = new HttpEntity<>(headers);
//			ResponseEntity<ElectricityResponse> responseEntity = restTemplate.exchange(url, HttpMethod.GET, entity, ElectricityResponse.class);
//
//			ResponseEntity<ElecResponse> responseEntity = restTemplate.getForEntity(url, ElecResponse.class);	
//			System.out.println(responseEntity.getBody()); 
//
//		}catch(Exception e) {
//			System.out.println("에러!!!");
//			e.printStackTrace();
//		}
//	}


