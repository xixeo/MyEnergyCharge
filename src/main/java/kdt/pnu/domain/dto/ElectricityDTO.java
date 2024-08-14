package kdt.pnu.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElectricityDTO {
	private String date; 
	private String city; 
	private String county;
	private Double elec_avg;
	private Double max_temp; 
	private Double min_temp; 
	private Double avg_temp; 
	private Double max_rh; 
	private Double min_rh; 
	private Double avg_rh; 
	private Double di; 
}
