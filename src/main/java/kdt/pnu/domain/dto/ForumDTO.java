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
@AllArgsConstructor
@NoArgsConstructor
public class ForumDTO implements Comparable<ForumDTO> {

	private int forum_id; 	
	private String date; 	
	private String username; 	
	private Double elec_total; 
	private String comment; 
	private String region;	
	private Double elec_diff; 
	private Integer days_diff;
	private String city;
	private Double max_temp; 
	private Double min_temp; 
	private Double avg_temp; 
	private Double max_rh; 
	private Double min_rh; 
	private Double avg_rh; 
	
	@Override
	public int compareTo(ForumDTO o) {

		if (this.getDate()==null || o.getDate() == null) 
			return 0;
		return this.getDate().compareTo(o.getDate());
	} 
}
