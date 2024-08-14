package kdt.pnu.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kdt.pnu.domain.dto.ElectricityDTO;
import kdt.pnu.service.ElectricityService;
import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
public class DataController {
	
//	private final WeatherService weatherService;
	private final ElectricityService eService;
	
	@GetMapping("/")
	public String hello() {
		return "hello";
	}
	
		
    @GetMapping("/electricity")
    public ResponseEntity<?> findByDateCityCounty(@RequestParam String date,
    										   @RequestParam String city,
    										   @RequestParam String county) {
    	System.out.println("===> findByDateCityCounty");
    	List<ElectricityDTO> list = eService.findByDateCityCounty(date,city,county);
    	return ResponseEntity.ok(list);
    }
    
 
}
