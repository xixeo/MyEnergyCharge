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
	
	
	
	
	
	
	
	
