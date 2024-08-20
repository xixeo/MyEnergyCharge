package kdt.pnu.persistence;

import org.springframework.data.jpa.repository.JpaRepository;


import kdt.pnu.domain.Weather;

public interface WeatherRepository extends JpaRepository<Weather, Integer> {
	
}
